'use strict';

const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { JSHINT } = require('jshint');
const postcss = require('postcss');
const sass = require('sass');
const { optimize } = require('svgo');
const { minify } = require('terser');
const packageInfo = require('../package.json');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src');
const output = path.join(root, 'dist');
const banner = `/*! ${packageInfo.name} v${packageInfo.version} | (c) ${new Date().getFullYear()} ${packageInfo.author.name} | ${packageInfo.license} License | ${packageInfo.repository.url} */\n`;

function listEntries(directory) {
	return fs.readdirSync(directory, { withFileTypes: true })
		.sort((first, second) => first.name.localeCompare(second.name));
}

function writeOutput(filePath, content) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, content);
}

async function writeScript(name, content) {
	const destination = path.join(output, 'js', name);
	writeOutput(destination, banner + content);

	const result = await minify(content);
	if (result.error) throw result.error;

	writeOutput(
		path.join(output, 'js', name.replace(/\.js$/, '.min.js')),
		banner + result.code
	);
}

async function buildScripts() {
	const scriptDirectory = path.join(source, 'js');

	for (const entry of listEntries(scriptDirectory)) {
		const entryPath = path.join(scriptDirectory, entry.name);

		if (entry.isDirectory()) {
			const scripts = listEntries(entryPath)
				.filter((file) => file.isFile() && file.name.endsWith('.js'));
			const allFiles = scripts.map((file) => path.join(entryPath, file.name));
			const mainFiles = allFiles.filter((file) => !file.endsWith('.polyfill.js'));

			if (mainFiles.length) {
				await writeScript(
					`${entry.name}.js`,
					mainFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
				);
			}

			if (allFiles.length) {
				await writeScript(
					`${entry.name}.polyfills.js`,
					allFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
				);
			}
		} else if (entry.isFile() && entry.name.endsWith('.js')) {
			await writeScript(entry.name, fs.readFileSync(entryPath, 'utf8'));
		}
	}
}

function lintScripts() {
	const scriptDirectory = path.join(source, 'js');
	const scripts = listEntries(scriptDirectory)
		.filter((entry) => entry.isFile() && entry.name.endsWith('.js'));

	for (const entry of scripts) {
		const filePath = path.join(scriptDirectory, entry.name);
		JSHINT(fs.readFileSync(filePath, 'utf8'));

		for (const issue of JSHINT.errors.filter(Boolean)) {
			console.error(`${entry.name}:${issue.line}:${issue.character} ${issue.reason}`);
		}
	}
}

async function buildStyles() {
	const sassDirectory = path.join(source, 'sass');
	const styles = [];

	function collectStyles(directory) {
		for (const entry of listEntries(directory)) {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				collectStyles(entryPath);
			} else if (entry.isFile() && /\.(scss|sass)$/.test(entry.name) && !entry.name.startsWith('_')) {
				styles.push(entryPath);
			}
		}
	}

	collectStyles(sassDirectory);

	for (const filePath of styles) {
		const relativePath = path.relative(sassDirectory, filePath);
		const cssPath = path.join(
			output,
			'css',
			relativePath.replace(/\.(scss|sass)$/, '.css')
		);
		const compiled = sass.compile(filePath, { style: 'expanded' });
		const prefixed = await postcss([
			autoprefixer({ cascade: true, remove: true })
		]).process(compiled.css, { from: filePath, to: cssPath });
		const css = banner + prefixed.css;

		writeOutput(cssPath, css);

		const minified = await postcss([
			cssnano({ discardComments: { removeAll: true } })
		]).process(css, { from: cssPath });
		writeOutput(cssPath.replace(/\.css$/, '.min.css'), minified.css);
	}
}

function buildSvgs() {
	const svgDirectory = path.join(source, 'svg');
	const files = listEntries(svgDirectory)
		.filter((entry) => entry.isFile() && entry.name.endsWith('.svg'));

	for (const entry of files) {
		const filePath = path.join(svgDirectory, entry.name);
		const result = optimize(fs.readFileSync(filePath, 'utf8'), { path: filePath });
		writeOutput(path.join(output, 'svg', entry.name), result.data);
	}
}

function copyDirectory(sourcePath, destinationPath) {
	for (const entry of listEntries(sourcePath)) {
		const sourceFile = path.join(sourcePath, entry.name);
		const destinationFile = path.join(destinationPath, entry.name);
		if (entry.isDirectory()) {
			copyDirectory(sourceFile, destinationFile);
		} else if (entry.isFile()) {
			fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
			fs.copyFileSync(sourceFile, destinationFile);
		}
	}
}

async function build() {
	fs.rmSync(output, { recursive: true, force: true });
	fs.mkdirSync(output, { recursive: true });

	await Promise.all([
		buildScripts(),
		buildStyles(),
		Promise.resolve().then(buildSvgs),
		Promise.resolve().then(() => copyDirectory(path.join(source, 'copy'), output))
	]);
	lintScripts();
}

module.exports = build;

if (require.main === module) {
	build().catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
