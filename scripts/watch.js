'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const build = require('./build');

const output = path.resolve(__dirname, '..', 'dist');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const clients = new Set();

const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.js': 'text/javascript; charset=utf-8',
	'.svg': 'image/svg+xml'
};

function sendReload() {
	for (const client of clients) {
		client.write('data: reload\n\n');
	}
}

function serveFile(request, response) {
	let requestPath;
	try {
		requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
	} catch (error) {
		response.writeHead(400);
		response.end('Bad request');
		return;
	}

	const relativePath = requestPath.replace(/^[/\\]+/, '') || 'index.html';
	const filePath = path.resolve(output, relativePath);
	if (filePath !== output && !filePath.startsWith(output + path.sep)) {
		response.writeHead(403);
		response.end('Forbidden');
		return;
	}

	fs.readFile(filePath, (error, content) => {
		if (error) {
			if (error.code === 'ENOENT' || error.code === 'EISDIR') {
				response.writeHead(404);
				response.end('Not found');
				return;
			}

			console.error(`Unable to serve ${filePath}:`, error);
			response.writeHead(500);
			response.end('Internal server error');
			return;
		}

		if (path.extname(filePath).toLowerCase() === '.html') {
			const liveReload = '<script>new EventSource("/__reload").addEventListener("message", function () { location.reload(); });</script>';
			content = Buffer.from(content.toString('utf8').replace(
				/<\/body>/i,
				`${liveReload}</body>`
			));
		}

		response.writeHead(200, {
			'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
		});
		response.end(request.method === 'HEAD' ? undefined : content);
	});
}

function createServer() {
	return http.createServer((request, response) => {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { Allow: 'GET, HEAD' });
			response.end();
			return;
		}

		if (request.url === '/__reload') {
			response.writeHead(200, {
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Content-Type': 'text/event-stream'
			});
			response.write('\n');
			clients.add(response);
			response.on('close', () => clients.delete(response));
			return;
		}

		serveFile(request, response);
	});
}

async function start() {
	await build();
	const server = createServer();
	let buildTimer;
	let buildQueue = Promise.resolve();
	const watcher = fs.watch(path.resolve(__dirname, '..', 'src'), { recursive: true }, () => {
		clearTimeout(buildTimer);
		buildTimer = setTimeout(() => {
			buildQueue = buildQueue
				.then(build)
				.then(sendReload)
				.catch((error) => console.error('Build failed:', error));
		}, 100);
	});

	server.listen(port, host, () => {
		console.log(`Serving dist at http://${host}:${port}`);
		console.log('Watching src for changes');
	});

	process.on('SIGINT', () => {
		watcher.close();
		for (const client of clients) {
			client.end();
		}
		clients.clear();
		server.close(() => process.exit(0));
	});
}

start().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
