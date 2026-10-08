# ECORE-JS-Validation-UI

A small form-validation helper that shows the number of invalid fields, scrolls to the first error, and refreshes the count as fields are corrected. It is designed to make long forms easier to navigate, especially on mobile devices.

## Demo

The demo is in `src/copy/index.html`. It includes a long form with intentionally empty required fields.

## Build and run

```sh
npm install
npm run build
npm run watch
```

`npm run build` writes the demo and compiled assets to `dist/`. `npm run watch` builds the project and starts a local server that reloads when source files change.

## Use on a form

Add the `ecore-validate` class to a form that uses standard HTML constraints such as `required`, `type="email"`, or `min`. Add one validation summary to the page and load the compiled script:

```html
<form class="ecore-validate">
  <label>
    Email
    <input name="email" type="email" required>
  </label>
  <button type="submit">Submit</button>
</form>

<aside class="ecore-validate-ui" role="status" aria-live="polite" aria-atomic="true" hidden>
  <span>Errors found: <strong class="error-count">0</strong></span>
  <button class="ecore-validate-next" type="button">Go to first error</button>
</aside>

<script src="js/ecore-validation-ui.js"></script>
```

The script prevents submission when the form contains invalid controls, marks those controls with `ecore-error`, and scrolls to the first invalid control. The summary updates on blur and control changes; after all errors are corrected, it is hidden. Include `css/main.css` for the demo's styling, or provide your own styles for the summary and `ecore-error` class. A single summary can be shared by multiple forms on the page.

## License

Released under the [MIT License](LICENSE.md).
