/*! ECORE-JS-Validation-UI v0.0.1 | (c) 2020 YOUR NAME | MIT License | https://github.com/edwardm/ECORE-JS-Validation-UI */
/* jshint esversion: 6 */
/* js - ecore validation ui */

let ecoreValidateContainer = document.querySelector(".ecore-validate");
let ecoreValidateUi = document.querySelector(".ecore-validate-ui");
let ecoreValidateErrorCount = document.querySelector(".error-count");
let ecoreValidateSubmit = document.querySelector(".ecore-validate-submit");
let ecoreValidateNextError = document.querySelector(".ecore-validate-next");
let ecoreValidateAllInputs = document.querySelector("input, textarea, select");
let ecoreValidateInvalidField;
let CurrentFormError
let FormErrorCount = 0;

document.addEventListener("DOMContentLoaded", (function () {
	/* check if the class exists */
	if (ecoreValidateContainer.length > 0) {

		function CheckErrorCount() {
			ecoreValidateInvalidField = ecoreValidateContainer.querySelectorAll("input:invalid, textarea:invalid, select:invalid");
			FormErrorCount = ecoreValidateInvalidField.length;
			console.log("FormErrorCount: " + FormErrorCount);
			ecoreValidateErrorCount.innerHTML = FormErrorCount;
		}

		function CheckForErrors() {
			ecoreValidateUi.style.display = "block";
			ecoreValidateUi.classList.remove('animate__animated', 'animate__fadeOutRight');
			ecoreValidateUi.classList.add('animate__animated', 'animate__bounce');

			CheckErrorCount();

			if (FormErrorCount !== 0) {
				CurrentFormError = ecoreValidateInvalidField[0]; /* 0 index to get the first*/
				console.log("CurrentFormError = " + CurrentFormError);

				CurrentFormError.scrollIntoView();
				CurrentFormError.classList.add('animate__animated', 'animate__shakeX');

				setTimeout((function () {
					CurrentFormError.classList.remove('animate__animated', 'animate__shakeX');
				}), 500);
			} else {
				console.log("no errors");
				ecoreValidateUi.classList.add('animate__animated', 'animate__fadeOutRight');
				// ecoreValidateUi.style.display = "none";
			}
		}

		function CheckErrorsOnBlurFocus() {
			CheckErrorCount();
			CheckForErrors();
		}

		// "next" button. make it scroll to error, or to top
		ecoreValidateSubmit.addEventListener("click", (e) => {
			if (ecoreValidateInvalidField.length !== null) {
				CheckForErrors();
			}
		});

		// error button to scroll to errors
		ecoreValidateNextError.addEventListener("click", (e) => {
			CheckErrorCount();
			if (FormErrorCount !== 0) {
				CheckForErrors();
			} else {
				ecoreValidateUi.classList.add('animate__animated', 'animate__fadeOutRight');
			}
		});

		// on BLUR of form fields
		ecoreValidateAllInputs.addEventListener("blur", (e) => {
			// set delay, for DOM to update
			setTimeout((function () {
				CheckErrorsOnBlurFocus();
			}), 200);

			if (document.querySelector("select") !== null) {
				document.querySelector("select").addEventListener("change", (e) => {
					// set delay, for DOM to update
					setTimeout((function () {
						CheckErrorsOnBlurFocus();
					}), 200);
				});
			}
		});
	} else {
		console.log("ecoreValidateContainer class not found or defined")
	}
}));