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

const renderOrderItems = (items) => {
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

const getUserOrder = async () => {
    const userId = sessionStorage.getItem('userId')

    const order = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`);
    console.log('order.data', order.data);

    
};

getUserOrder();