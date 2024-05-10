const emptyPage = (text) => {
    // Remove the #cart-add section
    const cartAddSection = document.getElementById('cart-add');
    cartAddSection.parentNode.removeChild(cartAddSection);

    // Remove the #cart section
    const cartSection = document.getElementById('cart');
    cartSection.parentNode.removeChild(cartSection);

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
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${shoppingcart_item_id}"]`);
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


const renderCartTotals = (items) => {
    const table = document.querySelector('#cart-add #subtotal table');
    //console(table);
    table.innerHTML = '';

    const cartSubtotal = items.reduce((total, item) => total + (item.product.price * item.qty), 0);


    const subtotalTr = document.createElement('tr');
    subtotalTr.innerHTML = `
        <td>Cart Subtotal</td>
        <td>฿${cartSubtotal}</td>
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
        <td>฿${cartSubtotal}</td>
    `;
    table.appendChild(TotalTr);
};

const renderCartItems = (items) => {
    const tbody = document.querySelector('#cart tbody');
    tbody.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#"><i class="fa-solid fa-circle-xmark" onclick="deleteItem('${item._id}')"></i></a></td>

            <td><img src="data:image/png;base64, ${item.product.image}"></td>
            <td>${item.product.name}</td>
            <td>฿${item.product.price}</td>
            <td>${item.qty}</td>
            <td>฿${item.product.price * item.qty}</td>
        `;
        row.setAttribute('id', item._id);
        tbody.appendChild(row);
    });
};

const getCart = async () => {
    try {
        const curUserId = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
            withCredentials: true
        });
        const userId = curUserId.data;
        const curUser = await axios.get(`http://localhost:8080/api/User/getUser/${userId}`)

        if (curUser.data.shoppingcart && curUser.data.shoppingcart.length > 0) {
            console.log("here cart", curUser.data.shoppingcart);
            const shoppingCartItems = await axios.get(`http://localhost:8080/api/ShoppingCartItem/getItemFromShoppingCart/${curUser.data._id}`);
            console.log("Shopping Cart Items:", shoppingCartItems.data);
            renderCartItems(shoppingCartItems.data); // Render cart items
            renderCartTotals(shoppingCartItems.data);
        } else {
            emptyPage("No products found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

getCart();