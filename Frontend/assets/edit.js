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


document.getElementById('addressSelect').addEventListener('change', function() {
    var selectElement = document.getElementById('addressSelect');
    var newAddressInput = document.getElementById('newAddressInput');

    if (selectElement.value === 'add_new_address') {
        selectElement.style.display = 'block    ';
        newAddressInput.style.display = 'block';
        newAddressInput.setAttribute('required', 'required');
    } else {
        selectElement.style.display = 'block';
        newAddressInput.style.display = 'none';
        newAddressInput.removeAttribute('required');
    }
});