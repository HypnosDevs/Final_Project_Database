const emptyPage = (text) => {
    // Remove the #cart section
    const cartSection = document.getElementById('cart');
    cartSection.parentNode.removeChild(cartSection);

    // Create an h1 element with the text "No products found" and class "no-product"
    const h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const pageHeaderSection = document.getElementById('button_create');
    const referenceNode = pageHeaderSection.nextElementSibling;

    // Insert the h1 element after the page-header section
    pageHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
}

const deleteProduct = async (product_id) => {
    try {
        // Delete the shopping cart item from the server
        await axios.delete(`http://localhost:8080/api/ShoppingCartItem/deleteShoppingCartItemByProduct/${product_id}`);

        // Delete the product from the server
        await axios.delete(`http://localhost:8080/api/Product/${product_id}/deleteProduct`);

        // Remove all td elements inside the corresponding row from the cart table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${product_id}"]`);
        if (rowToRemove) {
            const cellsToRemove = rowToRemove.querySelectorAll('td');
            cellsToRemove.forEach(cell => {
                cell.remove(); // Remove each td element from the row
            });

            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for product:', product_id);
        }

        const productsCount = document.querySelectorAll('#cart tbody tr').length;
        if (productsCount === 0) {
            emptyPage("No products found");
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

const renderProducts = (products) => {
    const tbody = document.querySelector('#cart tbody');
    // tbody.innerHTML = ''; // Clear existing content

    products.forEach(async product => {
        // console.log(product);
        const row = document.createElement('tr');
        let imgTd = `<td><img src="data:image/png;base64, ${product.image}"></td>`;
        if (product.image == undefined) {
            imgTd = `<td> </td>`;
        }

        if (product.category && product.category.length != 0) {
            let categoryArr = [];
            for (category of product.category) {
                const categoryName = await axios.get(`http://localhost:8080/api/Category/getCategory/${category}`);
                categoryArr.push(categoryName.data.name);
            }
            product.category = categoryArr;
        } else {
            product.category = '';
        }

        // console.log("loader", loader)


        loader.classList.add("loader-hidden");

        // loader.addEventListener("transitionend", () => {
        //     document.body.removeChild("loader");
        // })
        loader.remove();


        row.innerHTML = `
            <td><a href="#"><i class="fa-solid fa-circle-xmark" onclick="deleteProduct('${product._id}')"></i></a></td>
            ` + imgTd + `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>฿${product.price}</td>
            <td class="edit"><a href="/edit_product/${product._id}">Edit</a></td>
        `;
        row.setAttribute('id', product._id);
        tbody.appendChild(row);
    });

};

const getProducts = async () => {
    try {
        const products = await axios.get("http://localhost:8080/api/Product/getProduct");
        if (products.data && products.data.length > 0) {
            renderProducts(products.data);
        } else {
            emptyPage("No products found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

getProducts();