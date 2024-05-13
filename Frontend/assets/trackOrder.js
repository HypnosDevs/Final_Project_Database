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
    console.log('order', orders);


    tableBody.innerHTML = '';
    for (const orderData of orders) {
        let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${orderData._id}`);
        orderItems = orderItems.data;
        for (const orderItemData of orderItems) {
            const createdAt = new Date(orderData.createdAt);
            //  format the date as "YYYY-MM-DD HH:MM:SS"
            const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

            const row = document.createElement("tr");
            //<td><a href="#"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>

            row.innerHTML = `
                        
                        <td>${orderItemData._id}</td>
                        <td>${formattedDate}</td>
                        <td><img src="data:image/png;base64, ${orderItemData.product_image}"></td>
                        <td>${orderItemData.product_name}</td>
                        <td>${orderItemData.price}</td>
                        <td>${orderItemData.qty}</td>
                        <td>${orderItemData.discount}</td>
                        <td>${orderItemData.price * orderItemData.qty - orderItemData.discount}</td>
                        <td>
                            ${orderItemData.status}
                           
                        </td>
                        <td>
                            ${orderData.payment_type}
                           
                        </td>
                        
                    `;
            tableBody.appendChild(row);
        }
    }

    loader.classList.add("loader-hidden");

    loader.remove();
    // Clear existing rows

    // let k = 0;
    // for (const orderData of orderItems) {
    //     const createdAt = new Date(orderData.createdAt);
    //     //  format the date as "YYYY-MM-DD HH:MM:SS"
    //     const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

    //     const row = document.createElement("tr");
    //     //<td><a href="#"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>

    //     row.innerHTML = `

    //                     <td>${orderData._id}</td>
    //                     <td>${formattedDate}</td>
    //                     <td>${productName[k]}</td>
    //                     <td>${orderData.price}</td>
    //                     <td>${orderData.qty}</td>
    //                     <td>
    //                         ${orderData.status}

    //                     </td>
    //                     <td>
    //                         ${allPaymentType[k]}

    //                     </td>

    //                 `;
    //     tableBody.appendChild(row);
    //     k++;
    // }
}
loadData();