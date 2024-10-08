const emptyPage = (text) => {
    if (document.querySelector('.no-product')) {
        return;
    }
    // Remove the #cart-add section
    const cartAddSection = document.getElementById('cart-add');
    if (cartAddSection && cartAddSection.parentNode) cartAddSection.parentNode.removeChild(cartAddSection);

    // Remove the #cart section
    const cartSection = document.getElementById('cart');
    if (cartSection && cartSection.parentNode) cartSection.parentNode.removeChild(cartSection);

    // Create an h1 element with the text "No products found" and class "no-product"
    const h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const pageHeaderSection = document.getElementById('page-header');
    const referenceNode = pageHeaderSection.nextElementSibling;

    // Insert the h1 element after the page-header section
    pageHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
}
const deleteItem = async (shoppingcart_item_id) => {
    try {
        // Delete the item from the server
        await axios.delete(`http://localhost:8080/api/ShoppingCartItem/deleteShoppingCartItem/${shoppingcart_item_id}`);

        // Remove all td elements inside the corresponding row from the cart table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="shopitem${shoppingcart_item_id}"]`);
        if (rowToRemove) {
            const cellsToRemove = rowToRemove.querySelectorAll('td');
            cellsToRemove.forEach(cell => {
                cell.remove(); // Remove each td element from the row
            });

            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for item:', shoppingcart_item_id);
        }

        const cartItemsCount = document.querySelectorAll('#cart tbody tr').length;
        if (cartItemsCount === 0) {
            emptyPage("No products found");
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};


const renderCartTotals = (cartSubtotal) => {
    const table = document.querySelector('#cart-add #subtotal table');
    //console(table);
    table.innerHTML = '';

    const subtotalTr = document.createElement('tr');
    subtotalTr.innerHTML = `
        <td>Cart Subtotal</td>
        <td id="subtotal-value">฿${cartSubtotal}</td>
    `;
    table.appendChild(subtotalTr);

    const shippingTr = document.createElement('tr');
    shippingTr.innerHTML = `
        <td>Shipping</td>
        <td>Free</td>
    `;
    table.appendChild(shippingTr);

    const TotalTr = document.createElement('tr');
    TotalTr.innerHTML = `
        <td>Total</td>
        <td id="total-value">฿${cartSubtotal}</td>
    `;
    table.appendChild(TotalTr);
};

const renderCartItems = async (items) => {
    const tbody = document.querySelector('#cart tbody');
    tbody.innerHTML = ''; // Clear existing content


    let categoryId = 'categoryId';
    if (couponIdx != -1) {
        const discountCategory = await axios.get(`http://localhost:8080/api/DiscountCategory/getDiscountCategory/${couponData[couponIdx].discountcategory}`)
        categoryId = await discountCategory.data.category;
    }

    let cartSubtotal = 0;
    console.log(1);
    items.forEach(item => {
        let discount = 0;
        item.price = parseFloat(item.price);

        if (couponIdx != -1 && item.category_id.includes(categoryId) && item.price >= couponData[couponIdx].min_price) {
            if (item.price * couponData[couponIdx].discount / 100 > couponData[couponIdx].max_discount) {
                discount = couponData[couponIdx].max_discount;
            } else {
                discount = item.price * couponData[couponIdx].discount / 100;
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#"><i class="fa-solid fa-circle-xmark" onclick="deleteItem('${item.shopping_cart_item_id}')"></i></a></td>
<td class="image" id="product${item.product_item_id}"><img src="data:image/png;base64, ${item.product_image}"></td>            
            <td class="name">${item.product_name}</td>
            <td class="price">฿${item.price}</td>
            <td class="qty">${item.qty}</td>
            <td class="discount">฿${discount * item.qty}</td>
            <td class="subtotal">฿${(item.price - discount) * item.qty}</td>
            <td class="coupon">
                <div class="coupon" id="coupon">
                <button class="choose-coupon" id="choose-coupon-btn${item.shopping_cart_item_id}" ><strong>Choose</strong></button>
                 </div>
            </td>
        `;
        row.setAttribute('id', `shopitem${item.shopping_cart_item_id}`);
        tbody.appendChild(row);

        const chooseCouponBtn = document.querySelector(`#choose-coupon-btn${item.shopping_cart_item_id}`);
        chooseCouponBtn.addEventListener('click', () => {
            openPopup(couponPopup);

            populateCouponList(item.category_name, item.price * item.qty, `shopitem${item.shopping_cart_item_id}`, `choose-coupon-btn${item.shopping_cart_item_id}`);
        });

        cartSubtotal += (item.price - discount) * item.qty;
    });



    return cartSubtotal;
};

const getCart = async () => {
    try {
        const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
            withCredentials: true
        });
        const userId = curUserId.data;
        if (!userId) {
            return window.location.href = `/signIn`;
        }
        const curUser = await axios.get(`http://localhost:8080/api/User/getUser/${userId}`)
        
        let shoppingCartItems = await axios.get(`http://localhost:8080/api/ShoppingCartItem/getItemFromShoppingCart/${curUser.data.user_id}`);
        shoppingCartItems = shoppingCartItems.data;

        if (shoppingCartItems && shoppingCartItems.length > 0) {
            const selectPaymentType = document.getElementById('selectPaymentType');
            let allPaymentTypes = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentType`);
            allPaymentTypes = allPaymentTypes.data;
            allPaymentTypes.forEach(payment => {
                const option = document.createElement('option');
                option.setAttribute('value', payment.payment_name);
                option.innerHTML = payment.payment_name
                selectPaymentType.appendChild(option);

            })
            console.log("Shopping Cart Items:", shoppingCartItems);

            let cartSubtotal = 0;
            await renderCartItems(shoppingCartItems).then(subtotal => { cartSubtotal = subtotal }); // Render cart items
            renderCartTotals(cartSubtotal);


        } else {
            emptyPage("No products found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

getCart();