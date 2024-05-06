// Get elements
const changeBtn = document.getElementById('change-address-btn');
const addressPopup = document.getElementById('address-popup');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addressList = document.getElementById('address-list');

// Dummy user addresses (replace with actual backend data)
const userAddresses = [
    '123 Main Street, City, Country',
    '456 Elm Street, Town, Country',
    '789 Oak Street, Village, Country',
    '101 Pine Street, Hamlet, Country',
    '202 Maple Street, Suburb, Country',
    '303 Cedar Street, Borough, Country',
    '404 Walnut Street, District, Country',
    '505 Birch Street, Province, Country',
    '606 Spruce Street, State, Country',
    '707 Ash Street, Region, Country',
    '808 Chestnut Street, Territory, Country',
    '909 Fir Street, Territory, Country',
];

// Function to populate address list
function populateAddressList() {
  addressList.innerHTML = '';
  userAddresses.forEach(address => {
    const listItem = document.createElement('li');
    listItem.textContent = address;
    listItem.addEventListener('click', () => {
      document.getElementById('user-address').textContent = address;
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
