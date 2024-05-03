
const submitButton = document.querySelector("#submitButton");
const formData = document.querySelector("#form-register");
const usernameInput = document.querySelector("#username");
const passwordContainer = document.querySelector("#password");

submitButton.addEventListener("click", async () => {


    try{
        const response = await axios.post("http://localhost:8080/api/Authentication/checkUsername", {
            username: usernameInput.value
        });


        const inValid = response.data.exists;

        console.log(inValid);

        if (inValid) {
            // Check if the validation message already exists
            const existingValidationMessage = document.getElementById("validate-text");
            if (!existingValidationMessage) {
                const validationMessage = document.createElement("div");
                validationMessage.id = "validate-text";
                validationMessage.classList.add("validate");
                validationMessage.textContent = "Username already exists";
                submitButton.parentNode.insertBefore(validationMessage, passwordContainer);
            }
        } else {
            // Remove the validation message if it exists
            const existingValidationMessage = document.getElementById("validate-text");
            if (existingValidationMessage) {
                existingValidationMessage.parentNode.removeChild(existingValidationMessage);
            }
            // formData.submit();
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
            formData.appendChild(validationMessage);
        }
    }
});