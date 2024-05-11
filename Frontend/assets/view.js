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

const renderOrderItems = (orderItems) => {
    const tbody = document.querySelector('#user-table tbody');

    orderItems.forEach(async orderItem => {
        const product = await axios.get(`http://localhost:8080/api/Product/getProduct/${orderItem.product}`);
        const productName = product.data.name;

        const order = await axios.get(`http://localhost:8080/api/Order/getOrder/${orderItem.order}`);
        const paymentType = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentTypeFromUserPaymentMethod/${order.data.paymentmethod}`);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a onclick=""><i id="remove"class="fa-solid fa-circle-xmark"></i></a></td>
            <td>${orderItem.order}</td>
            <td>${orderItem.createdAt}</td>
            <td>${productName}</td>
            <td>฿${orderItem.price}</td>
            <td>${orderItem.qty}</td>
            <td>${orderItem.status}</td>
            <td>${paymentType.data.name}</td>
        `;
        row.setAttribute('id', orderItem._id);
        tbody.appendChild(row);
    });
};

const getUserOrder = async () => {
    const userId = sessionStorage.getItem('userId')

    let orders = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`);
    orders = orders.data;

    orders.forEach(async order => {
        let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${order._id}`);
        orderItems = orderItems.data;

        renderOrderItems(orderItems);
    });
};

getUserOrder();