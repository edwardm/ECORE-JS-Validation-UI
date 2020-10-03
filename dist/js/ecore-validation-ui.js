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
let FormErrorCount = 0;

document.addEventListener("DOMContentLoaded", (function () {
	/* check if the class exists */
	if (ecoreValidateContainer.length > 0) {

		function CheckErrorCount() {
			ecoreValidateInvalidField = document.querySelectorAll("input:invalid, textarea:invalid, select:invalid");
			FormErrorCount = ecoreValidateInvalidField.length;
			console.log("FormErrorCount: " + FormErrorCount);
			ecoreValidateErrorCount.innerHTML = FormErrorCount;
		}

		function CheckForErrors() {
			ecoreValidateUi.css("display", "block").addClass('animated bounce');;

			CheckErrorCount();

			let FormError = ecoreValidateInvalidField.first();

			//console.log(FormError);
			$("html,body").animate({
				scrollTop: $(FormError).offset().top - 200
			}, 'fast');

			$(FormError).addClass('animated shake');
			setTimeout((function () {
				$(FormError).removeClass('shake');
			}), 500);
		}

		function CheckErrorsOnBlurFocus() {
			CheckErrorCount();
			if (!ecoreValidateInvalidField.length) {
				$(".ecore-validate-ui, .validation-summary-errors").css("display", "none");
			}
		}

		// "next" button. make it scroll to error, or to top
		ecoreValidateSubmit.addEventListener("click", (e) => {
			if (ecoreValidateInvalidField.length > 0) {
				CheckForErrors();
			}
		});

		// $(".btn-back").on("click", function () {
		// 	// on back button, let the error checking hide
		// 	// since you leave the section, it can cause confusion
		// 	$(".ecore-validate-ui, .validation-summary-errors").css("display", "none");
		// });

		// error button to scroll to errors
		ecoreValidateNextError.addEventListener("click", (e) => {
			CheckErrorCount();
			if (ecoreValidateInvalidField.length > 0) {
				CheckForErrors();
			} else {
				$(".ecore-validate-ui, .validation-summary-errors").css("display", "none");
			}
		});

		// on ANY .btn OR <a> click, perform a check
		// do NOT perform function on a.btn-next elements
		// $(".btn, a:not(.btn-next)").on("click", function () {
		// 	// set delay, for DOM to update
		// 	setTimeout(function () {
		// 		CheckErrorsOnBlurFocus();
		// 	}, 400);
		// });

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