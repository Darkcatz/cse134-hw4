const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const textareas = document.querySelectorAll("textarea");
let form_errors = [];

inputs.forEach(input => {
    const inputError = input.nextElementSibling;
    
    input.addEventListener("input", (event) => {
        if (input.validity.valid) {
            inputError.textContent = "";
            inputError.className = "error";
        } else {
            showError(input, inputError);
        }
    });
});

textareas.forEach(textarea => {
    const charCounter = textarea.nextElementSibling;
    const charCount = charCounter.querySelector('#char-count');
    const textareaError = charCounter.nextElementSibling;
    const maxLength = parseInt(textarea.getAttribute('maxlength'));
    
    textarea.addEventListener("input", (event) => {
        const remaining = maxLength - textarea.value.length;
        charCount.textContent = remaining;
        
        if (remaining <= 10) {
            charCounter.className = "char-counter danger";
        } else if (remaining <= 50) {
            charCounter.className = "char-counter warning";
        } else {
            charCounter.className = "char-counter";
        }
        
        if (textarea.value.length > maxLength) {
            showError(textarea, textareaError);
        } else if (textarea.validity.valid) {
            textareaError.textContent = "";
            textareaError.className = "error";
        } else {
            showError(textarea, textareaError);
        }
    });
});

form.addEventListener("submit", (event) => {
    inputs.forEach(input => {
        const inputError = input.nextElementSibling;
        if (!input.validity.valid) {
            showError(input, inputError);
            event.preventDefault();
        }
    });
});

form.addEventListener("submit", (event) => {
    let hasErrors = false;
    
    inputs.forEach(input => {
        const inputError = input.nextElementSibling;
        if (!input.validity.valid) {
            showError(input, inputError);
            hasErrors = true;
        }
    });
    
    textareas.forEach(textarea => {
        const charCounter = textarea.nextElementSibling;
        const textareaError = charCounter.nextElementSibling;
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        
        if (!textarea.validity.valid || textarea.value.length > maxLength) {
            showError(textarea, textareaError);
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        event.preventDefault();
    } else {
        const errorField = document.createElement('input');
        errorField.type = 'hidden';
        errorField.name = 'form-errors';
        errorField.value = JSON.stringify(form_errors);
        form.appendChild(errorField);
    }
});

function showError(input, errorElement) {
    let errorType = "";
    let errorMessage = "";
    
    if (input.validity.valueMissing) {
        errorType = "valueMissing";
        errorMessage = "This field is required.";
    } else if (input.validity.typeMismatch) {
        errorType = "typeMismatch";
        errorMessage = "Please enter a valid format.";
    } else if (input.validity.patternMismatch) {
        errorType = "patternMismatch";
        errorMessage = "Please match the required format.";
    } else if (input.tagName === 'TEXTAREA' && input.value.length > parseInt(input.getAttribute('maxlength'))) {
        errorType = "tooLong";
        errorMessage = "Message exceeds maximum character limit.";
    }
    
    
    logError(input, errorType, errorMessage);
    
    errorElement.textContent = errorMessage;
    errorElement.className = "error active";

    setTimeout(() => {
        errorElement.style.opacity = "0";
        setTimeout(() => {
            errorElement.textContent = "";
            errorElement.className = "error";
            errorElement.style.opacity = "1";
        }, 300);
    }, 3000);
}

function logError(element, errorType, errorMessage){
    const timestamp = new Date().toISOString();
    const error = {
        field_id: element.id,
        field_name: element.name,
        field_type: element.tagName.toLowerCase(),
        error_type: errorType,
        error_message: errorMessage,
        field_value: element.value,
        timestamp: timestamp
    };
    form_errors.push(error);
}