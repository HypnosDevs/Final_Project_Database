// Get elements
const changeBtn = document.getElementById('change-address-btn');
const addressPopup = document.getElementById('address-popup');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addressList = document.getElementById('address-list');

async function getUserAddress () {
  try {
    const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });
    const addresses = await axios.get(`http://localhost:8080/api/Address/getAllAddressFromUser/${curUserId.data}`)
    const addressesData = addresses.data.address;

    let result = [];
    for(let i = 0; i < addressesData.length ; i++) {
      result.push(`${ addressesData[i].name + ' ' +
                      addressesData[i].address_line1 + ' ' +
                      addressesData[i].address_line2 + ' ' +
                      addressesData[i].district + ' ' +
                      addressesData[i].amphoe + ' ' +
                      addressesData[i].province + ' ' +
                      addressesData[i].country + ' ' +
                      addressesData[i].postal_code + ' ' +
                      addressesData[i].tel_no
      }`);
    };

    return result;
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
}

// Dummy user addresses (replace with actual backend data)
let userAddresses = '';
getUserAddress().then(data => {userAddresses = data});

let addressIdx = -1;

// Function to populate address list
function populateAddressList() {
  addressList.innerHTML = '';
  userAddresses.forEach((address, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = address;
    listItem.addEventListener('click', () => {
      document.getElementById('user-address').textContent = address;
      addressIdx = index;
      closePopup();
    });
    addressList.appendChild(listItem);
  });
}

// Function to open popup
function openPopup() {
  addressPopup.style.display = 'block';
  populateAddressList();
}

// Function to close popup
function closePopup() {
  addressPopup.style.display = 'none';
}

// Event listeners
changeBtn.addEventListener('click', openPopup);
confirmBtn.addEventListener('click', closePopup);
cancelBtn.addEventListener('click', closePopup);
