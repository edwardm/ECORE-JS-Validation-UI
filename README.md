# ECORE-JS-Validation-UI

## Summary
This plugin allows for a toast style element to appear when a validation error occurs on a user form. This type of feature is already a common UI feature, but this takes it a step further by not only giving you an error count, but it wall take you to the first error to be addressed. Upon fixing the error (on event blur), it will automatically scroll to the next error if one exists. As fields are corrected, the error count will automatically re-calculate.

## What's so special?
This plugin is intended for very long web forms where users may have a hard time trying to find where a validation errors occurs. This ideal situation would apply especially to mobile/tablet devices. I would recommend a UI aid such as this to allow for a more pleasant user experience with lengthy forms.

## Getting Started
```
$ git clone https://github.com/edwardm/ECORE-JS-Validation-UI.git
```
```npm
$ npm install
```

## Notes
To get straight to the demo, I have already pre-filled data into the form, purposely leaving some fields blank to force a validation error, thus triggering the script. All you need to do is click "SUBMIT" down below.

## License
The code is available under the [MIT License](LICENSE.md).
