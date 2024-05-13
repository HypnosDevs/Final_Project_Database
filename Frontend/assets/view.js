document.querySelectorAll(".selection").forEach(function(selectStatus) {
    selectStatus.addEventListener("change", function() {
        switch(selectStatus.value) {
            case "Pending":
                selectStatus.style.backgroundColor = "#eafffa";
                break;
            case "Shipping":
                selectStatus.style.backgroundColor = "#fcefff";
                break;
            case "Delivered":
                selectStatus.style.backgroundColor = "#dcffe0";
                break;
            default:
                selectStatus.style.backgroundColor = "eafffa"; // Reset background color if none of the cases match
        }
    });
});

const emptyPage = (text) => {
    // Remove the #board section
    const boardSection = document.getElementById('board');
    if (boardSection && boardSection.parentNode) boardSection.parentNode.removeChild(boardSection);

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

const deleteOrderItem = async (order_item_id) => {
    try {
        // Delete the item from the server
        await axios.delete(`http://localhost:8080/api/OrderItem/deleteOrderItemByOrderItemId/${order_item_id}`);

        // Remove all td elements inside the corresponding row from the cart table
        const rowToRemove = document.querySelector(`#user-table tbody tr[id="${order_item_id}"]`);
        if (rowToRemove) {
            const cellsToRemove = rowToRemove.querySelectorAll('td');
            cellsToRemove.forEach(cell => {
                cell.remove(); // Remove each td element from the row
            });

            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for item:', order_item_id);
        }

        const cartItemsCount = document.querySelectorAll('#user-table tbody tr').length;
        if (cartItemsCount === 0) {
            emptyPage("No products found");
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};

const renderOrderItems = (orderItems) => {
    const tbody = document.querySelector('#user-table tbody');

    orderItems.forEach(async orderItem => {
        const product = await axios.get(`http://localhost:8080/api/Product/getProduct/${orderItem.product}`);
        const productName = product.data.name;

        const order = await axios.get(`http://localhost:8080/api/Order/getOrder/${orderItem.order}`);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a onclick="deleteOrderItem('${orderItem._id}')"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>
            <td>${orderItem.order}</td>
            <td>${orderItem.createdAt}</td>
            <td>${productName}</td>
            <td>฿${orderItem.price}</td>
            <td>${orderItem.qty}</td>
            <td>${orderItem.status}</td>
            <td>${order.data.payment_type}</td>
        `;
        row.setAttribute('id', orderItem._id);
        tbody.appendChild(row);
    });
};

const getUserOrder = async () => {
    const userId = sessionStorage.getItem('userId')

    let orders = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`);
    orders = orders.data;

    if (orders && orders.length != 0) {
        orders.forEach(async order => {
            let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${order._id}`);
            orderItems = orderItems.data;

            renderOrderItems(orderItems);
        });
    } else {
        emptyPage("No products found");
    }
};

getUserOrder();