// Get elements
const change_address_Btn = document.getElementById('change-address-btn');
const change_payment_Btn = document.getElementById('change-payment-btn');

const addressPopup = document.getElementById('address-popup');
const paymentPopup = document.getElementById('payment-popup');

const add_addressBtn = document.getElementById('add-address-btn');
const add_paymentBtn = document.getElementById('add-payment-btn');


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


let addressIdx = -1;
let selectedAddressId = null;


// Function to populate address list
async function populateAddressList() {
  await getUserAddress().then(data => { userAddresses = data });
  addressList.innerHTML = '';
  for (let i = 0; i < userAddresses.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = userAddresses[i].name;
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
// //console.log("getUserPaymentMethodInfo ", userPaymentsInfo);
let paymentIdx = -1;
async function populatePaymentList() {
  await getUserPaymentMethod().then(data => { userPaymentsInfo = data });
  console.log(userPaymentsInfo)
  paymentList.innerHTML = '';
  for (let i = 0; i < userPaymentsInfo.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = userPaymentsInfo[i].account_number;
    listItem.addEventListener('click', async () => {
      selectedPaymentId = userPaymentsInfo[i].id;
      const data = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentTypeFromUserPaymentMethod/${userPaymentsInfo[i].id}`);
      document.querySelector("#user-payment").innerHTML = `Type: ${data.data.name}<div><br></div>Account number: ${userPaymentsInfo[i].account_number}<div><br></div>Expiry date: ${userPaymentsInfo[i].expiry_date}`;

      //console.log("selected payment id", selectedPaymentId);
      // document.getElementById('user-payment').textContent = userPaymentsInfo[i].expiry_date;
      // console.log("payment-list", document.getElementById('payment-list').textContent);
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
change_address_Btn.addEventListener('click', async () => {
  // console.log("here")
  openPopup(addressPopup);
  populateAddressList();

});

change_payment_Btn.addEventListener('click', async () => {
  await populatePaymentList();
  openPopup(paymentPopup);

});

add_addressBtn.addEventListener('click', () => {
  if (addressIdx !== -1) {
    document.getElementById('user-address').textContent = userAddresses[addressIdx];
    closePopup(addressPopup);
  }
}

);

cancel_addressBtn.addEventListener('click', () => {
  closePopup(addressPopup);
});

cancel_paymentBtn.addEventListener('click', () => {
  closePopup(paymentPopup);
});

// Popup for adding address
const add_addressPopup = document.getElementById('add-address-popup');
const cancel_add_addressBtn = document.getElementById('cancel-add-address-btn');

const submit_addressBtn = document.getElementById('submit-add-address-btn');
const addressForm = document.getElementById('add-address-form');

add_addressBtn.addEventListener('click', () => {
  closePopup(addressPopup);
  openPopup(add_addressPopup);
});

submit_addressBtn.addEventListener('click', async () => {
  const formData = new FormData(addressForm);

  const address = {
    name: Array.from(formData)[0][1],
    address_line1: Array.from(formData)[1][1],
    address_line2: Array.from(formData)[2][1],
    country: Array.from(formData)[3][1],
    province: Array.from(formData)[4][1],
    amphoe: Array.from(formData)[5][1],
    district: Array.from(formData)[6][1],
    postal_code: Array.from(formData)[7][1],
    tel_no: Array.from(formData)[8][1],
  };

  console.log(address);

  let userId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
    withCredentials: true
  });
  userId = userId.data



  const addAddress = await axios.post(`http://localhost:8080/api/Address/addAddress/${userId}`, address)

  closePopup(add_addressPopup);

  await populateAddressList();

  openPopup(addressPopup)

});

cancel_add_addressBtn.addEventListener('click', () => {
  closePopup(add_addressPopup);
  openPopup(addressPopup);
});




function showProvinces() {
  let countrySelect = document.getElementById("country");
  let provinceSelect = document.getElementById("province");
  let url = "https://ckartisan.com/api/provinces";

  if (countrySelect.value === "Thailand") {
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


function showAmphoes() {
  let provinceSelect = document.getElementById("province");
  let amphoeSelect = document.getElementById("amphoe");
  let url = "https://ckartisan.com/api/amphoes?province=" + provinceSelect.value;

  if (provinceSelect.value !== "") {
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

function showDistricts() {
  let provinceSelect = document.getElementById("province");
  let amphoeSelect = document.getElementById("amphoe");
  let districtSelect = document.getElementById("district");
  let url = "https://ckartisan.com/api/tambons?province=" + provinceSelect.value + "&amphoe=" + amphoeSelect.value;
  if (amphoeSelect.value !== "") {
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

function showPostCode() {
  let provinceSelect = document.getElementById("province");
  let amphoeSelect = document.getElementById("amphoe");
  let districtSelect = document.getElementById("district");
  let postalCode = document.getElementById("postal_code");
  let url = "https://ckartisan.com/api/zipcodes?province=" + provinceSelect.value + "&amphoe=" + amphoeSelect.value + "&tambon=" + districtSelect.value;
  console.log(url);
  if (districtSelect.value !== "") {
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

// Popup for adding payment
const add_paymentPopup = document.getElementById('add-payment-popup');
const cancel_add_paymentBtn = document.getElementById('cancel-add-payment-btn');
const submit_paymentBtn = document.getElementById('submit-add-payment-btn');

add_paymentBtn.addEventListener('click', () => {
  closePopup(paymentPopup);
  openPopup(add_paymentPopup);
});

cancel_add_paymentBtn.addEventListener('click', () => {
  closePopup(add_paymentPopup);
  openPopup(paymentPopup);
});

const paymentForm = document.getElementById('add-payment-form');

submit_paymentBtn.addEventListener('click', async () => {
  const formData = new FormData(paymentForm);

  const payment = {
    type: Array.from(formData)[0][1],
    account_name: Array.from(formData)[1][1],
    account_number: Array.from(formData)[2][1],
    expiry_date: Array.from(formData)[3][1],
  };

  let userId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
    withCredentials: true
  });
  userId = userId.data

  const paymentType = await axios.post("http://localhost:8080/api/PaymentType/addPaymentType", {
    name: payment.type
  })

  const paymentMethod = await axios.post(`http://localhost:8080/api/PaymentMethod/addPaymentMethod/${userId}`, payment)

  closePopup(add_paymentPopup);

  await populatePaymentList();

  openPopup(paymentPopup)

});

const check_outBtn = document.getElementById('check-out-btn');

check_outBtn.addEventListener('click', async () => {
  await getUserPaymentMethod().then(data => { userPaymentsInfo = data });
  const paymentId = userPaymentsInfo[paymentIdx].id;

  let userId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
    withCredentials: true
  });
  userId = userId.data

  let address = await axios.get(`http://localhost:8080/api/Address/getAddress/${selectedAddressId}`)
  address = address.data
  address._id = undefined;

  const order = await axios.post(`http://localhost:8080/api/Order/addOrder/${paymentId}/${userId}`, address);
  const orderId = order.data._id;

  const shoppingCartItems = await axios.get(`http://localhost:8080/api/ShoppingCartItem/getItemFromShoppingCart/${userId}`);
  const shoppingCartItemsData = shoppingCartItems.data
  console.log('shoppingCartItems', shoppingCartItems)

  shoppingCartItemsData.forEach(async item => {
    const shoppingCartItem = {
      status: 'Pending',
      qty: item.qty,
      price: 1
    }

    const productId = item.product._id;

    console.log('productId', productId)

    const orderItem = await axios.post(`http://localhost:8080/api/OrderItem/addOrderItem/${orderId}/${productId}`, shoppingCartItem);
  });

});
// submit_paymentBtn.addEventListener('click', () => {
//   closePopup(add_paymentPopup);
// });




/*------------------------------------------------------------------------*/
/*                          Popup coupon code                             */
/*------------------------------------------------------------------------*/
const chooseCouponBtn = document.getElementById('choose-coupon-btn');
const couponPopup = document.getElementById('coupon-popup');
const couponList = document.getElementById('coupon-list');

const cancelCouponBtn = document.getElementById('cancel-coupon-btn');
const applyCouponBtn = document.getElementById('apply-coupon-btn');

function populateCouponList() {
  couponList.innerHTML = '';
  const coupons = ['10% off', '20% off', '30% off'];
  coupons.forEach(coupon => {
    const listItem = document.createElement('li');
    listItem.textContent = coupon;
    listItem.addEventListener('click', () => {
      document.getElementById('coupon-code').textContent = coupon;
      closePopup(couponPopup);
    });
    couponList.appendChild(listItem);
  });
}

chooseCouponBtn.addEventListener('click', () => {
  openPopup(couponPopup);
  populateCouponList();
});

cancelCouponBtn.addEventListener('click', () => {
  closePopup(couponPopup);
});

applyCouponBtn.addEventListener('click', () => {
  closePopup(couponPopup);
});
