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

const emptyPage = (text) => {
    let h1Element = document.querySelector('.no-product');
    if (h1Element) {
        h1Element.textContent = `${text}`;
        return;
    }
    h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const boardHeaderSection = document.querySelector('#order-head');
    const referenceNode = boardHeaderSection.nextElementSibling;
    // console.log(referenceNode)
    // Insert the h1 element after the page-header section
    boardHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
}



const loadData = async (req, res) => {
    const loader = document.querySelector('.loader')

    let curUser = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
        withCredentials: true
    });

    const userId = curUser.data;
    console.log('curUser', userId);
    let orders = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`)
    orders = orders.data;
    console.log('order', orders);


    for (const orderData of orders) {
        let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${orderData.order_id}`);
        orderItems = orderItems.data;
        for (const orderItemData of orderItems) {
            console.log('hereee', orderItemData);
            const createdAt = new Date(orderData.created_at);
            //  format the date as "YYYY-MM-DD HH:MM:SS"
            const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;
            // Create wraporder div
            const wraporderDiv = document.createElement("div");
            wraporderDiv.classList.add("wraporder");

            // Create orderstattus div
            const orderstattusDiv = document.createElement("div");
            orderstattusDiv.classList.add("orderstattus");
            const orderIdSpan = document.createElement("span");
            orderIdSpan.classList.add("order-id");
            orderIdSpan.textContent = `Order id: ${orderItemData.order_item_id}`;
            const orderStatusButton = document.createElement("button");
            if (orderItemData.order_status === "Pending") {
                orderStatusButton.style.backgroundColor = "#ffffea";
            }
            else if (orderItemData.order_status === "Shipping") {
                orderStatusButton.style.backgroundColor = "#fcefff";
            }
            else if (orderItemData.order_status === "Delivered") {
                orderStatusButton.style.backgroundColor = "#dcffe0";
            }
            orderStatusButton.classList.add("order-status");
            orderStatusButton.setAttribute("type", "button");
            orderStatusButton.textContent = `${orderItemData.order_status}`;
            orderstattusDiv.appendChild(orderIdSpan);
            orderstattusDiv.appendChild(orderStatusButton);
            wraporderDiv.appendChild(orderstattusDiv);

            // Create hr element
            const hr1 = document.createElement("hr");
            wraporderDiv.appendChild(hr1);

            // Create container div
            const containerDiv = document.createElement("div");
            containerDiv.classList.add("container");

            // Create wrap-image div
            const wrapImageDiv = document.createElement("div");
            wrapImageDiv.classList.add("wrap-image");

            // Create product-image div
            const productImageDiv = document.createElement("div");
            productImageDiv.classList.add("product-image");
            const productImage = document.createElement("img");
            productImage.src =
                `data:image/png;base64, ${orderItemData.product_image}`
            productImage.alt = "";
            productImageDiv.appendChild(productImage);
            wrapImageDiv.appendChild(productImageDiv);

            // Create product-name div
            const productNameDiv = document.createElement("div");
            productNameDiv.classList.add("product-name");
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("name");
            nameDiv.textContent = `${orderItemData.product_name}`;
            const qtyDiv = document.createElement("div");
            qtyDiv.classList.add("qty");
            qtyDiv.textContent = `x${orderItemData.qty}`;
            productNameDiv.appendChild(nameDiv);
            productNameDiv.appendChild(qtyDiv);
            wrapImageDiv.appendChild(productNameDiv);

            containerDiv.appendChild(wrapImageDiv);

            // Create product-price div
            const productPriceDiv = document.createElement("div");
            productPriceDiv.classList.add("product-price");
            const dateDiv = document.createElement("div");
            dateDiv.classList.add("date");
            dateDiv.textContent = `Date: ${formattedDate}`;
            const priceDiv = document.createElement("div");
            priceDiv.classList.add("price");
            priceDiv.textContent = `Price: ${orderItemData.price * orderItemData.qty} THB`;
            const discountDiv = document.createElement("div");
            discountDiv.classList.add("discount");
            const iElement = document.createElement("i");
            iElement.classList.add("fa-solid", "fa-ticket");
            discountDiv.appendChild(iElement);
            discountDiv.innerHTML += `: ${orderItemData.discount} THB`; // Append the colon and discount text using innerHTML
            productPriceDiv.appendChild(dateDiv);
            productPriceDiv.appendChild(priceDiv);
            productPriceDiv.appendChild(discountDiv);
            containerDiv.appendChild(productPriceDiv);

            wraporderDiv.appendChild(containerDiv);

            // Create hr element
            const hr2 = document.createElement("hr");
            wraporderDiv.appendChild(hr2);

            // Create total-price div
            // Create foot-order div
            const footOrderDiv = document.createElement("div");
            footOrderDiv.classList.add("foot-order");
            const paymentTypeDiv = document.createElement("div");
            paymentTypeDiv.classList.add("payment-type");
            paymentTypeDiv.textContent = `Payment type: ${orderData.payment_type}`;
            const totalPriceDiv = document.createElement("div");
            totalPriceDiv.classList.add("total-price");
            totalPriceDiv.textContent = `Total: ${orderItemData.price * orderItemData.qty - orderItemData.discount} THB`;
            footOrderDiv.appendChild(paymentTypeDiv);
            footOrderDiv.appendChild(totalPriceDiv);
            wraporderDiv.appendChild(footOrderDiv);


            // Find the footer element with class "section-p1"
            const footerElement = document.querySelector("footer.section-p1");

            // Insert the wraporderDiv before the footer element
            footerElement.parentNode.insertBefore(wraporderDiv, footerElement);



            // const row = document.createElement("tr");
            // //<td><a href="#"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>

            // row.innerHTML = `

            //             <td>${orderItemData._id}</td>
            //             <td>${formattedDate}</td>
            //             <td><img src="data:image/png;base64, ${orderItemData.product_image}"></td>
            //             <td>${orderItemData.product_name}</td>
            //             <td>${orderItemData.price}</td>
            //             <td>${orderItemData.qty}</td>
            //             <td>${orderItemData.discount}</td>
            //             <td>${orderItemData.price * orderItemData.qty - orderItemData.discount}</td>
            //             <td>
            //                 ${orderItemData.status}

            //             </td>
            //             <td>
            //                 ${orderData.payment_type}

            //             </td>

            //         `;
            // tableBody.appendChild(row);
        }
    }

    loader.classList.add("loader-hidden");

    loader.remove();

    if (orders.length === 0) {
        emptyPage('No Order');
    }

}
loadData();