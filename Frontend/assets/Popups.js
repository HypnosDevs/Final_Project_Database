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
    const addressesData = addresses.data;

    let result = [];
    for (let i = 0; i < addressesData.length; i++) {
      // Ensure address_line2 is empty string if it's null
      if (addressesData[i].address_line2 === null) {
        addressesData[i].address_line2 = '';
      }

      // Construct the text property with non-null values only
      let textParts = [
        addressesData[i].address_line1,
        addressesData[i].address_line2,
        addressesData[i].district,
        addressesData[i].amphoe,
        addressesData[i].province,
        addressesData[i].country_name,
        addressesData[i].postal_code,
        addressesData[i].tel_no
      ];

      // Filter out null values and join with a space
      let text = textParts.filter(part => part !== null && part !== '').join(' ');

      // Push the formatted address object to result array
      result.push({
        id: addressesData[i].address_id,
        name: addressesData[i].address_name,
        text: text
      });
    }

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
    const paymentsData = payments.data;

    let result = [];
    for (let i = 0; i < paymentsData.length; i++) {
      result.push({
        id: paymentsData[i].payment_id,
        account_number: paymentsData[i].account_number,
        account_name: paymentsData[i].account_name,
        expiry_date: paymentsData[i].payment_expiry_date
      });
    };

    return result;

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
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
let paymentIdx = -1;
async function populatePaymentList() {
  await getUserPaymentMethod().then(data => { userPaymentsInfo = data });
  paymentList.innerHTML = '';
  for (let i = 0; i < userPaymentsInfo.length; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = userPaymentsInfo[i].account_number;
    listItem.addEventListener('click', async () => {
      selectedPaymentId = userPaymentsInfo[i].id;
      const data = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentTypeFromUserPaymentMethod/${userPaymentsInfo[i].id}`);
      document.querySelector("#user-payment").innerHTML = `Type: ${data.data.payment_name}<div><br></div>Account number: ${userPaymentsInfo[i].account_number}<div><br></div>Expiry date: ${userPaymentsInfo[i].expiry_date}`;

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
    address_name: Array.from(formData)[0][1],
    address_line1: Array.from(formData)[1][1],
    address_line2: Array.from(formData)[2][1],
    country: Array.from(formData)[3][1],
    province: Array.from(formData)[4][1],
    amphoe: Array.from(formData)[5][1],
    district: Array.from(formData)[6][1],
    postal_code: Array.from(formData)[7][1],
    tel_no: Array.from(formData)[8][1],
  };

  // console.log(address);

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
  // console.log(url);
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
    payment_type: Array.from(formData)[0][1],
    account_name: Array.from(formData)[1][1],
    account_number: Array.from(formData)[2][1],
    payment_expiry_date: Array.from(formData)[3][1],
  };

  let userId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
    withCredentials: true
  });
  userId = userId.data


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

  let paymentType = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentTypeFromUserPaymentMethod/${paymentId}`)
  // console.log('paymenttype', paymentType.data);
  userPaymentsInfo[paymentIdx].payment_type = paymentType.data.payment_name;
  userPaymentsInfo[paymentIdx].id = undefined;

  const insertData = { ...address, ...userPaymentsInfo[paymentIdx] };
  console.log('knee', insertData)

  const order = await axios.post(`http://localhost:8080/api/Order/addOrder/${paymentId}/${userId}`, insertData);
  const orderId = order.data.order_id;

  // const shoppingCartItems = await axios.get(`http://localhost:8080/api/ShoppingCartItem/getItemFromShoppingCart/${userId}`);
  // const shoppingCartItemsData = shoppingCartItems.data
  const shoppingCartItems = document.querySelectorAll("#cart tbody tr")
  // console.log('shoppingCartItems', shoppingCartItems)

  shoppingCartItems.forEach(async item => {
    const shoppingcartId = item.id;
    const productId = document.querySelector(`#${shoppingcartId} .image`).id.replace('product', '');
    const productImageSrc = document.querySelector(`#${shoppingcartId} .image img`).src;

    const shoppingCartItem = {
      status: 'Pending',
      qty: parseInt(document.querySelector(`#${shoppingcartId} .qty`).textContent),
      price: parseInt(document.querySelector(`#${shoppingcartId} .price`).textContent.replace('฿', '')),
      discount: parseInt(document.querySelector(`#${shoppingcartId} .discount`).textContent.replace('฿', '')),
      product_image: productImageSrc.replace('data:image/png;base64, ', ''), // Corrected line
      product_name: document.querySelector(`#${shoppingcartId} .name`).textContent
    };

    // console.log('shoppingCartItem', shoppingCartItem);
    // console.log('productId', productId);
    // console.log('productImageSrc', productImageSrc);
    // console.log(shoppingCartItem);
    const orderItem = await axios.post(`http://localhost:8080/api/OrderItem/addOrderItem/${orderId}/${productId}`, shoppingCartItem);


    await axios.delete(`http://localhost:8080/api/ShoppingCartItem/deleteAllShoppingCartItem/${userId}`);

    return window.location.href = `/trackOrder`;
  });


});
// submit_paymentBtn.addEventListener('click', () => {
//   closePopup(add_paymentPopup);
// });




/*------------------------------------------------------------------------*/
/*                          Popup coupon code                             */
/*------------------------------------------------------------------------*/
const chooseCouponBtn = document.querySelectorAll('.choose-coupon-btn');
const couponPopup = document.getElementById('coupon-popup');
const couponList = document.getElementById('coupon-list');

const cancelCouponBtn = document.getElementById('cancel-coupon-btn');
const applyCouponBtn = document.getElementById('apply-coupon-btn');

let couponIdx = -1;
let couponData = [];

async function populateCouponList(categoryProduct, productPrice, shoppingcartId, buttonId) {
  couponList.innerHTML = '';

  let coupons = await axios.get("http://localhost:8080/api/Discount/getDiscount");
  coupons = coupons.data;
  coupons.forEach(async coupon => {
    const discountCategories = await axios.get(`http://localhost:8080/api/DiscountCategory/getDiscountCategoryByDiscountId/${coupon.discount_id}`)
    for (const discountCategory of discountCategories.data) {
      const categoryId = discountCategory.category_id;
      const categoryName = await axios.get(`http://localhost:8080/api/Category/getCategory/${categoryId}`);
      const allProdCatName = categoryProduct;

      if (!allProdCatName.includes(categoryName.data.category_name) || productPrice < coupon.min_price) {
        continue;
      }
      const listItem = document.createElement('li');
      listItem.innerHTML = `Category: ${categoryName.data.category_name} ${coupon.discount}%</br>Min price: ${coupon.min_price} THB</br>Max discount ${coupon.max_discount}`;
      listItem.addEventListener('click', async () => {

        const prodPrice = parseInt(document.querySelector(`#${shoppingcartId} .price`).textContent.replace('฿', ''));
        const qty = parseInt(document.querySelector(`#${shoppingcartId} .qty`).textContent);
        let subtotal = prodPrice * qty;
        let tmpDiscount = Math.ceil((subtotal * parseInt(coupon.discount)) / 100);
        if (tmpDiscount > coupon.max_discount * qty) {
          tmpDiscount = coupon.max_discount * qty;
        }

        subtotal -= tmpDiscount;
        document.querySelector(`#${shoppingcartId} .discount`).innerHTML = '฿' + tmpDiscount;
        document.querySelector(`#${shoppingcartId} .subtotal`).innerHTML = '฿' + subtotal;
        document.querySelector('#subtotal-value').innerHTML = '฿' + String(Number(document.querySelector('#subtotal-value').innerHTML.slice(1)) - tmpDiscount)
        document.querySelector('#total-value').innerHTML = '฿' + String(Number(document.querySelector('#total-value').innerHTML.slice(1)) - tmpDiscount)
        document.getElementById(buttonId).innerHTML = `${coupon.discount}%`


        closePopup(couponPopup);
      });

      couponList.appendChild(listItem);
    }



  });

}

cancelCouponBtn.addEventListener('click', () => {
  closePopup(couponPopup);
});

applyCouponBtn.addEventListener('click', () => {
  closePopup(couponPopup);
});
