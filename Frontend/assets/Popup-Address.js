// Get elements
const change_address_Btn = document.getElementById('change-address-btn');
const change_payment_Btn = document.getElementById('change-payment-btn');

const addressPopup = document.getElementById('address-popup');
const paymentPopup = document.getElementById('payment-popup');

const confirm_addressBtn = document.getElementById('confirm-address-btn');
const confirm_paymentBtn = document.getElementById('confirm-payment-btn');


const cancel_addressBtn = document.getElementById('cancel-adress-btn');
const cancel_paymentBtn = document.getElementById('cancel-payment-btn');


const addressList = document.getElementById('address-list');
const paymentList = document.getElementById('payment-list');

async function getUserAddress() {
  try {
    const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
      withCredentials: true
    });
    const addresses = await axios.get(`http://localhost:8080/api/Address/getAllAddressFromUser/${curUserId.data}`)
    const addressesData = addresses.data.address;

    let result = [];
    for (let i = 0; i < addressesData.length; i++) {
      result.push(`${addressesData[i].name + ' ' +
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
getUserAddress().then(data => { userAddresses = data });

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
      closePopup(addressPopup);
    });
    addressList.appendChild(listItem);
  });
}

// need to edit
let userPayments = ['Credit Card', 'Debit Card', 'Net Banking'];

let paymentIdx = -1;
function populatePaymentList() {
  paymentList.innerHTML = '';
  userPayments.forEach((payment, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = payment;
    listItem.addEventListener('click', () => {
      document.getElementById('user-payment').textContent = payment;
      paymentIdx = index;
      closePopup(paymentPopup);
    });
    paymentList.appendChild(listItem);
  });
}
  

// Function to open popup(both address and payment)
function openPopup(popup) {
  popup.style.display = 'block';
}

// Function to close popup(both address and payment)
function closePopup(popup) {
  popup.style.display = 'none';

}

// Event listeners
change_address_Btn.addEventListener('click', () => {
  openPopup(addressPopup);
  populateAddressList();
});

change_payment_Btn.addEventListener('click', () => {
  openPopup(paymentPopup);
  populatePaymentList();
});

confirm_addressBtn.addEventListener('click', () => {
  if (addressIdx !== -1) {
    document.getElementById('user-address').textContent = userAddresses[addressIdx];
    closePopup(addressPopup);
  }
}

);

confirm_paymentBtn.addEventListener('click', () => {
  if (paymentIdx !== -1) {
    document.getElementById('user-payment').textContent = userPayments[paymentIdx];
    closePopup(paymentPopup);
  }
});

cancel_addressBtn.addEventListener('click', () => {
  closePopup(addressPopup);
});

cancel_paymentBtn.addEventListener('click', () => {
  closePopup(paymentPopup);
});

