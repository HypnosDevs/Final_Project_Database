const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");

one.onclick = function () {
    one.classList.add("active");
    two.classList.remove("active");
    three.classList.remove("active");
    four.classList.remove("active");
}

two.onclick = function () {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.remove("active");
    four.classList.remove("active");
}
three.onclick = function () {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.remove("active");

}
four.onclick = function () {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
}

const loadData = async (req, res) => {
    const loader = document.querySelector('#loader')

    let productName = [];
    let orderUserId = [];
    let allPaymentType = [];
    const tableBody = document.querySelector("#board tbody");

    let curUser = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });


    const userId = curUser.data;
    console.log('curUser', userId);
    let orders = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`)
    orders = orders.data;
    let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${orders._id}`);
    orderItems = orderItems.data;

    for (const orderData of orders) {
        let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${orders._id}`);
        orderItems = orderItems.data;
        for (const orderItemData of orderItems) {
            const product = await axios.get(`http://localhost:8080/api/Product/getProduct/${orderItemData.product}`);
            productName.push(product.data.name);
            orderUserId.push(orderData.user);
            allPaymentType.push(orderData.payment_type);
        }
    }

    loader.classList.add("loader-hidden");

    loader.remove();
    // Clear existing rows
    tableBody.innerHTML = '';
    let k = 0;
    for (const orderData of orderItems) {
        const createdAt = new Date(orderData.createdAt);
        //  format the date as "YYYY-MM-DD HH:MM:SS"
        const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

        const row = document.createElement("tr");
        row.innerHTML = `
                        
                       <td><a href="#"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>
                        <td>${orderData._id}</td>
                        <td>${formattedDate}</td>
                        <td>${productName[k]}</td>
                        <td>${orderData.price}</td>
                        <td>${orderData.qty}</td>
                        <td>
                            ${orderData.status}
                           
                        </td>
                        <td>
                            ${allPaymentType[k]}
                           
                        </td>
                        
                    `;
        tableBody.appendChild(row);
        k++;
    }
}
loadData();