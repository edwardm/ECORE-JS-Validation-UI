/* jshint esversion: 6 */

(function () {
    "use strict";

    var forms = document.querySelectorAll(".ecore-validate");
    var validationUi = document.querySelector(".ecore-validate-ui");

    if (!forms.length) {
        return;
    }

    if (!validationUi) {
        console.error("ECORE Validation UI requires an .ecore-validate-ui element.");
        return;
    }

    var errorCount = validationUi.querySelector(".error-count");
    var nextError = validationUi.querySelector(".ecore-validate-next");
    var activeForm = forms[0];

    if (!errorCount || !nextError) {
        console.error("ECORE Validation UI requires an error count and next-error button.");
        return;
    }

    function getInvalidControls(form) {
        return form.querySelectorAll(
            "input:invalid, select:invalid, textarea:invalid"
        );
    }

    function clearHighlights() {
        forms.forEach(function (form) {
            form.querySelectorAll(".ecore-error").forEach(function (control) {
                control.classList.remove("ecore-error");
            });
        });
    }

    function update(form, reveal) {
        activeForm = form;
        var invalidControls = getInvalidControls(form);
        errorCount.textContent = invalidControls.length;

        clearHighlights();

        if (!invalidControls.length) {
            validationUi.hidden = true;
            return;
        }

        if (!reveal) {
            return;
        }

        invalidControls.forEach(function (control) {
            control.classList.add("ecore-error");
        });

        validationUi.hidden = false;
        invalidControls[0].scrollIntoView({
            behavior: "auto",
            block: "center"
        });
    }

    forms.forEach(function (form) {
        form.noValidate = true;
        form.addEventListener("submit", function (event) {
            var invalidControls = getInvalidControls(form);
            update(form, true);

            if (invalidControls.length) {
                event.preventDefault();
            }
        });

        form.addEventListener("focusout", function (event) {
            if (event.target.matches("input, select, textarea")) {
                update(form, true);
            }
        });

        form.addEventListener("change", function (event) {
            if (event.target.matches("input, select, textarea")) {
                update(form, true);
            }
        });

        form.addEventListener("reset", function () {
            window.setTimeout(function () {
                activeForm = form;
                errorCount.textContent = getInvalidControls(form).length;
                clearHighlights();
                validationUi.hidden = true;
            }, 0);
        });
    });

    nextError.addEventListener("click", function () {
        update(activeForm, true);
    });

    update(activeForm, false);
})();
