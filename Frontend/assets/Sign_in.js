const validateText = document.querySelector("#validate-text");
const signInForm = document.querySelector("#signInForm");
const submitButton = document.querySelector("#submitButton");


submitButton.addEventListener("click", async () => {
    try {
        console.log('here');
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        const res = await axios.post('http://localhost:8080/api/Authentication/checkMatch', {
            username,
            password
        })

        const match = res.data.isValid;


        if (!match) {
            // Check if the validation message already exists
            const existingValidationMessage = document.getElementById("validate-text");
            if (!existingValidationMessage) {
                // Create and insert the validation message
                const validationMessage = document.createElement("div");
                validationMessage.id = "validate-text";
                validationMessage.classList.add("validate");
                validationMessage.textContent = "Invalid username or password";
                submitButton.parentNode.insertBefore(validationMessage, submitButton);
            }
        } else {
            // Remove the validation message if it exists
            const existingValidationMessage = document.getElementById("validate-text");
            if (existingValidationMessage) {
                existingValidationMessage.parentNode.removeChild(existingValidationMessage);
            }
            // Submit the form
            signInForm.submit();
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
        // Handle error - display a generic error message to the user
        const existingValidationMessage = document.getElementById("validate-text");
        if (!existingValidationMessage) {
            const validationMessage = document.createElement("div");
            validationMessage.id = "validate-text";
            validationMessage.classList.add("validate");
            validationMessage.textContent = "An error occurred. Please try again later.";
            submitButton.parentNode.insertBefore(validationMessage, submitButton);
        }
    }
});
