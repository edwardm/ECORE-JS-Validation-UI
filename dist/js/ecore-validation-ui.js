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
let CurrentFormError;
let FormErrorCount = 0;

document.addEventListener("DOMContentLoaded", (function () {
    /* check if the class exists */
    if (ecoreValidateContainer.length > 0) {
        // check SILENTLY
        CheckErrorCount();

        // on CLICK
        // "go to error" button
        ecoreValidateNextError.addEventListener("click", (e) => {
            CheckErrorCount();
            CheckForErrors();

            ecoreValidateContainer
                .querySelectorAll(
                    "input:invalid",
                    "textarea:invalid",
                    "select:invalid"
                )
                .forEach((item) => {
                    item.classList.add("ecore-error");
                });

            if (FormErrorCount !== 0) {
                CheckForErrors();
            } else {
                ecoreValidateUi.classList.add(
                    "animate__animated",
                    "animate__fadeOutRight"
                );
            }
        });

        // on CLICK
        // "submit" button
        ecoreValidateSubmit.addEventListener("click", (e) => {
            // CheckErrorsOnBlurFocus();

            CheckErrorCount();
            CheckForErrors();

            ecoreValidateContainer
                .querySelectorAll(
                    "input:invalid",
                    "textarea:invalid",
                    "select:invalid"
                )
                .forEach((item) => {
                    item.classList.add("ecore-error");
                });

            if (FormErrorCount !== 0) {
                CheckForErrors();
            } else {
                ecoreValidateUi.classList.add(
                    "animate__animated",
                    "animate__fadeOutRight"
                );
            }
        });

        // BLUR
        // all INPUT fields
        ecoreValidateContainer
            .querySelectorAll("input", "type", "textarea")
            .forEach((item) => {
                item.addEventListener("blur", (e) => {
                    CheckErrorCount();
                    CheckForErrors();

                    ecoreValidateContainer
                        .querySelectorAll(
                            "input:invalid",
                            "textarea:invalid",
                            "select:invalid"
                        )
                        .forEach((item) => {
                            item.classList.add("ecore-error");
                        });

                    // set delay, for DOM to update
                    // setTimeout(function () {
                    // 	CheckErrorsOnBlurFocus();
                    // }, 200);

                    if (document.querySelector("select") !== null) {
                        document
                            .querySelector("select")
                            .addEventListener("change", (e) => {
                                // set delay, for DOM to update
                                setTimeout((function () {
                                    CheckErrorsOnBlurFocus();
                                }), 200);
                            });
                    }
                });
            });
    } else {
        console.log("ecoreValidateContainer class not found or defined");
    }

    function CheckErrorCount() {
        // hold all invalid fields
        ecoreValidateInvalidField = ecoreValidateContainer.querySelectorAll(
            "input:invalid",
            "textarea:invalid",
            "select:invalid"
        );
        // count all invalid fields
        FormErrorCount = ecoreValidateInvalidField.length;
        console.log("FormErrorCount: " + FormErrorCount);
        // display count in html
        ecoreValidateErrorCount.innerHTML = FormErrorCount;
    }

    function CheckForErrors() {
        ecoreValidateUi.style.display = "block";
        ecoreValidateUi.classList.remove(
            "animate__animated",
            "animate__fadeOutRight"
        );
        ecoreValidateUi.classList.add("animate__animated", "animate__bounce");

        ecoreValidateContainer
            .querySelectorAll("input", "textarea", "select")
            .forEach((item) => {
                item.classList.remove("ecore-error");
            });

        if (FormErrorCount !== 0) {
            ecoreValidateContainer
                .querySelectorAll(
                    "input:invalid",
                    "textarea:invalid",
                    "select:invalid"
                )
                .forEach((item) => {
                    item.classList.add("ecore-error");
                });

            CurrentFormError =
                ecoreValidateInvalidField[0]; /* 0 index to get the first*/
            console.log("CurrentFormError = " + CurrentFormError);

            // reset class to fix
            // ecoreValidateContainer.querySelectorAll("input", "textarea", "select").forEach(item => {
            // 	item.classList.remove("ecore-error");
            // })

            // CurrentFormError.scrollIntoView();

            window.scrollTo({
                top: CurrentFormError.offsetTop - 200,
                behavior: "smooth",
            });

            CurrentFormError.classList.add(
                "animate__animated",
                "animate__shakeX"
            );

            setTimeout((function () {
                CurrentFormError.classList.remove(
                    "animate__animated",
                    "animate__shakeX"
                );
            }), 500);

            // ecoreValidateContainer.querySelectorAll("input:invalid", "textarea:invalid", "select:invalid").forEach(item => {
            // 	item.classList.add("ecore-error");
            // })
        } else {
            console.log("no errors");

            ecoreValidateContainer
                .querySelectorAll("input", "textarea", "select")
                .forEach((item) => {
                    item.classList.remove("ecore-error");
                });

            ecoreValidateUi.classList.add(
                "animate__animated",
                "animate__fadeOutRight"
            );
            // ecoreValidateUi.style.display = "none";
        }
    }

    function CheckErrorsOnBlurFocus() {
        CheckErrorCount();
        CheckForErrors();
    }
}));
