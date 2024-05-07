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
      result.push({
        id: addressesData[i]._id, name: addressesData[i].name, text: `${addressesData[i].address_line1 + ' ' +
          addressesData[i].address_line2 + ' ' +
          addressesData[i].district + ' ' +
          addressesData[i].amphoe + ' ' +
          addressesData[i].province + ' ' +
          addressesData[i].country + ' ' +
          addressesData[i].postal_code + ' ' +
          addressesData[i].tel_no
          }`
      });
    };

    return result;

  } catch (err) {
    //console.log(err.message);
    // res.status(500).send({ message: err.message });
  }
}

async function getUserPaymentMethod() {
  try {
    const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
      withCredentials: true
    });
    const payments = await axios.get(`http://localhost:8080/api/PaymentMethod/getAllPaymentMethodFromUser/${curUserId.data}`)
    const paymentsData = payments.data.paymentmethod;
    //console.log("payment", paymentsData)

    let result = [];
    for (let i = 0; i < paymentsData.length; i++) {
      result.push({
        id: paymentsData[i]._id,
        account_number: paymentsData[i].account_number,
        expiry_date: paymentsData[i].expiry_date
      });
    };
    //console.log("in function pay", result);
    return result;

  } catch (err) {
    //console.log(err.message);
    // res.status(500).send({ message: err.message });
  }
}


// Dummy user addresses (replace with actual backend data)
let userAddresses = '';
getUserAddress().then(data => { userAddresses = data });

let addressIdx = -1;
let selectedAddressId = null;


// Function to populate address list
function populateAddressList() {
  addressList.innerHTML = '';
  for (let i = 0; i < userAddresses.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = userAddresses[i].text;
    listItem.addEventListener('click', () => {
      document.querySelector("#address-name").innerHTML = userAddresses[i].name;
      selectedAddressId = userAddresses[i].id;
      //console.log("selected id", selectedAddressId);
      document.getElementById('user-address').textContent = userAddresses[i].text;
      addressIdx = i;
      closePopup(addressPopup);
    });
    addressList.appendChild(listItem);
  };
}

// function populateAddressList() {
//   addressList.innerHTML = '';
//   userAddresses.forEach((address, index) => {
//     const listItem = document.createElement('li');
//     listItem.textContent = address;
//     listItem.addEventListener('click', () => {
//       document.getElementById('user-address').textContent = address;
//       addressIdx = index;
//       closePopup(addressPopup);
//     });
//     addressList.appendChild(listItem);
//   });
// }

// need to edit
let selectedPaymentId = null;
let userPayments = ['Credit Card', 'Debit Card'];
let userPaymentsInfo = '';
getUserPaymentMethod().then(data => { userPaymentsInfo = data });
// //console.log("getUserPaymentMethodInfo ", userPaymentsInfo);
let paymentIdx = -1;
function populatePaymentList() {
  //console.log(userPaymentsInfo)
  paymentList.innerHTML = '';
  for (let i = 0; i < userPaymentsInfo.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = userPaymentsInfo[i].account_number;
    listItem.addEventListener('click', () => {
      document.querySelector("#payment-list").innerHTML = userPaymentsInfo[i].account_number;
      selectedPaymentId = userPaymentsInfo[i].id;
      //console.log("selected payment id", selectedPaymentId);
      document.getElementById('payment-list').textContent = userPaymentsInfo[i].text;
      paymentIdx = i;
      closePopup(paymentPopup);
    });
    paymentList.appendChild(listItem);
  };
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

