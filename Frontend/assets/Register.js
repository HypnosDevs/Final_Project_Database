
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
            formData.submit();
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

function showProvinces(){
            let countrySelect = document.getElementById("country");
            let provinceSelect = document.getElementById("province");
            let url = "https://ckartisan.com/api/provinces";
        
            if (countrySelect.value === "Thailand"){
                fetch(url)
                .then(response => response.json())
                .then(result => {
                    provinceSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
                    setTimeout(() => {
                        provinceSelect.innerHTML = '<option value="" disabled selected>Select Province</option>';
                        for (let item of result) {
                            let option = document.createElement("option");
                            option.text = item.province;
                            option.value = item.province;
                            provinceSelect.appendChild(option);
                        }
                        provinceSelect.disabled = false;
                    }, 100);
                }
                );
            }
            else {
                provinceSelect.innerHTML = '<option value="" disabled selected>Select Province</option>';
                provinceSelect.disabled = true;
            }
        }


function showAmphoes(){
    let provinceSelect = document.getElementById("province");
    let amphoeSelect = document.getElementById("amphoe");
    let url = "https://ckartisan.com/api/amphoes?province=" + provinceSelect.value;

    if (provinceSelect.value !== ""){
        fetch(url)
        .then(response => response.json())
        .then(result => {
            amphoeSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
            setTimeout(() => {
                amphoeSelect.innerHTML = '<option value="" disabled selected>Select Amphoe</option>';
                for (let item of result) {
                    let option = document.createElement("option");
                    option.text = item.amphoe;
                    option.value = item.amphoe;
                    amphoeSelect.appendChild(option);
                }
                amphoeSelect.disabled = false;
            }, 100);
        }
        );
    }
    else {
        amphoeSelect.innerHTML = '<option value="" disabled selected>Select Amphoe</option>';
        amphoeSelect.disabled = true;
    }
}

function showDistricts(){
    let provinceSelect = document.getElementById("province");
    let amphoeSelect = document.getElementById("amphoe");
    let districtSelect = document.getElementById("district");
    let url = "https://ckartisan.com/api/tambons?province=" + provinceSelect.value + "&amphoe=" + amphoeSelect.value;
    if (amphoeSelect.value !== ""){
        fetch(url)
        .then(response => response.json())
        .then(result => {
            districtSelect.innerHTML = '<option value="" disabled selected>Loading...</option>';
            setTimeout(() => {
                districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
                for (let item of result) {
                    let option = document.createElement("option");
                    option.text = item.tambon;
                    option.value = item.tambon;
                    districtSelect.appendChild(option);
                }
                districtSelect.disabled = false;
            }, 100);
        }
        );
    }
    else {
        districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
        districtSelect.disabled = true;
    }
}

function showPostCode(){
    let provinceSelect = document.getElementById("province");
    let amphoeSelect = document.getElementById("amphoe");
    let districtSelect = document.getElementById("district");
    let postalCode = document.getElementById("postal_code");
    let url = "https://ckartisan.com/api/zipcodes?province=" + provinceSelect.value + "&amphoe=" + amphoeSelect.value + "&tambon=" + districtSelect.value;
    console.log(url);
    if (districtSelect.value !== ""){
        fetch(url)
        .then(response => response.json())
        .then(result => {
            for (let item of result) {
                postalCode.value = item.zipcode;
            }
        }
        );
    }
    else {
        postalCode.value = "";
    }
}

