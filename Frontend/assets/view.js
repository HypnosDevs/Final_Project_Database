const emptyPage = (text) => {
    // Create an h1 element with the text "No products found" and class "no-product"
    const h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const boardHeaderSection = document.getElementById('board');
    const referenceNode = boardHeaderSection.nextElementSibling;

    // Insert the h1 element after the page-header section
    boardHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
};

const deleteOrderItem = async (order_item_id) => {
    try {
        // Delete the item from the server
        await axios.delete(`http://localhost:8080/api/OrderItem/deleteOrderItemByOrderItemId/${order_item_id}`);

        window.location.reload();

    } catch (error) {
        console.error('Error deleting item:', error);
        // Optionally, you can inform the user about the deletion error
        // For example:
        alert('An error occurred while deleting the order item. Please try again later.');
    };
};

let orderItemPaymentType = [];

const loadOrders = async (allOrderItems) => {
    const headerTable = document.querySelector("#user-table thead");
    // Clear existing rows
    headerTable.innerHTML = '';

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>Remove</td>
        <td>Order Id</td> 
        <td>Order Date</td>
        <td>Product Name</td>
        <td>Price</td>
        <td>Quantity</td>
        <td>Status</td>
        <td>Payment Type</td>
    `;
    headerTable.appendChild(row);

    if (allOrderItems.length > 0) {
        const tableBody = document.querySelector("#user-table tbody");
        // Clear existing rows
        tableBody.innerHTML = '';

        let k = 0;
        for (const orderItem of allOrderItems) {
            // Format the date as "YYYY-MM-DD HH:MM:SS"
            const createdAt = new Date(orderItem.createdAt);
            const formattedDate = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getDate().toString().padStart(2, '0')} ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;

            const row = document.createElement("tr");
            row.setAttribute("id", `${orderItem._id}`);
            row.innerHTML = `             
                <td><a onClick="deleteOrderItem('${orderItem._id}')"><i id="remove" class="fa-solid fa-circle-xmark"></i></a></td>
                <td>${orderItem._id}</td>
                <td>${formattedDate}</td>
                <td>${orderItem.product_name}</td>
                <td>฿${orderItem.price - orderItem.discount}</td>
                <td>${orderItem.qty}</td>
                <td>${orderItem.status}</td>
                <td>${orderItemPaymentType[k]}</td>     
            `;
            tableBody.appendChild(row);
            k++;
        };
    } else {
        emptyPage("No Orders found");
    };
};

const loadSpending = async (spendingData) => {
    const headerTable = document.querySelector("#user-table thead");
    // Clear existing rows
    headerTable.innerHTML = '';

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>Category</td>
        <td>Number of Product</td> 
        <td>Total Spending</td>
    `;
    headerTable.appendChild(row);

    if (spendingData.length > 0) {
        const tableBody = document.querySelector("#user-table tbody");
        // Clear existing rows
        tableBody.innerHTML = '';

        for (const data of spendingData) {
            const row = document.createElement("tr");
            row.innerHTML = `             
                <td>${data.categoryName}</td>
                <td>${data.totalQty}</td>
                <td>฿${data.totalSales}</td> 
            `;
            tableBody.appendChild(row);
        };
    } else {
        emptyPage("No Orders found");
    };
};

const removeLoader = () => {
    const loader = document.querySelector("#loader");
    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader");
    });

    const rowLoader = document.querySelector("#loader");
    rowLoader.remove();
}

const allowedRole = ["ADMIN"];
const allOrders = document.querySelector("#orders_page");
const allSpending = document.querySelector("#category_page");

const loadData = async () => {
    try {
        let curUser = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
            withCredentials: true
        });
        if (!curUser.data) {
            window.location.href = "/"
        } else {
            curUser = await axios.get(`http://localhost:8080/api/User/getUser/${curUser.data}`);
            const userId = curUser.data._id;
            console.log(userId);
            const role = curUser.data.role;
            if (allowedRole.includes(role)) {
                // const userId = sessionStorage.getItem('userId');

                let orders = await axios.get(`http://localhost:8080/api/Order/getOrderFromUser/${userId}`);
                orders = orders.data;

                let allOrderItems = [];
                for (const order of orders) {
                    let orderItems = await axios.get(`http://localhost:8080/api/OrderItem/getOrderItemFromOrder/${order._id}`);
                    orderItems = orderItems.data;

                    for (const orderItem of orderItems) {
                        // if (orderItem.status != 'Delivered') {
                        //     continue;
                        // };
                        allOrderItems.push(orderItem)
                    };
                };

                let allOrderItemCategories = [];
                for (const orderItem of allOrderItems) {
                    const order = await axios.get(`http://localhost:8080/api/Order/getOrder/${orderItem.order}`);
                    orderItemPaymentType.push(order.data.payment_type);

                    let categories = await axios.get(`http://localhost:8080/api/Category/getAllCategoryFromProduct/${orderItem.product}`);
                    allOrderItemCategories.push(categories.data.category);
                };
                console.log("pooh 0");
                let spendingData = await axios.get(`http://localhost:8080/api/Analyze/bestCategoryFromUser/${userId}`);
                spendingData = spendingData.data;
                let priceSum = await axios.get(`http://localhost:8080/api/Analyze/getUserTotalSpending/${userId}`);
                console.log(priceSum);
                if (priceSum.data.length === 0) {
                    removeLoader();
                    throw "No Orders found";
                }
                priceSum = priceSum.data[0].totalSpending;
                console.log("pooh 1", priceSum);
                // for (let i = 0; i < allOrderItems.length; i++) {
                //     priceSum += allOrderItems[i].price - allOrderItems[i].discount;
                //     for (const category of allOrderItemCategories[i]) {
                //         const categoryName = category.name;

                //         const idx = spendingData.findIndex(e => e.category === categoryName);
                //         if (idx > -1) {
                //             spendingData[idx].qty += allOrderItems[i].qty;
                //             spendingData[idx].price += allOrderItems[i].price - allOrderItems[i].discount;
                //         } else {
                //             spendingData.push(
                //                 {
                //                     category: categoryName,
                //                     qty: allOrderItems[i].qty,
                //                     price: allOrderItems[i].price - allOrderItems[i].discount
                //                 }
                //             );
                //         };
                //     };
                // };
                // spendingData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

                let orderItemsLength = document.querySelector("#orderItems-length");
                orderItemsLength.innerHTML = allOrderItems.length;
                let totalSpending = document.querySelector("#totalSpending")
                totalSpending.innerHTML = priceSum;

                removeLoader();

                loadOrders(allOrderItems);

                allOrders.addEventListener("click", async () => {
                    const emptyPage = document.querySelector(".no-product");
                    if (emptyPage && emptyPage.parentNode) {
                        emptyPage.parentNode.removeChild(emptyPage);
                    };
                    await loadOrders(allOrderItems);
                });

                allSpending.addEventListener("click", async () => {
                    const emptyPage = document.querySelector(".no-product");
                    if (emptyPage && emptyPage.parentNode) {
                        emptyPage.parentNode.removeChild(emptyPage);
                    };
                    await loadSpending(spendingData);
                });

            } else {
                console.log("Permission not allowed");
                window.location.href = "/"
            };
        };
    } catch (err) {
        emptyPage(`${err}`);
    };
};

loadData();