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

const renderPromotions= (promotions) => {
    const tbody = document.querySelector('#cart tbody');
    tbody.innerHTML = ''; // Clear existing content

    promotions.forEach(async promotion => {
        const row = document.createElement('tr');
        if (promotion.category && promotion.category.length != 0) {
            let categoryArr = [];
            for (category of promotion.category) {
                const categoryName = await axios.get(`http://localhost:8080/api/Category/getCategory/${category}`);
                categoryArr.push(categoryName.data[0].name);     
            }
            promotion.category = categoryArr;
        } else {
            promotion.category = '';
        }
        row.innerHTML = `
            <td><a href="#"><i class="fa-solid fa-circle-xmark" onclick="deleteProduct('${promotion._id}')"></i></a></td>
            <td>${promotion.discount}%</td>
            <td>${promotion.category}</td>
            <td class="edit"><a href="/edit_product/${promotion._id}">Edit</a></td>
        `;
        row.setAttribute('id', promotion._id);
        tbody.appendChild(row);
    });
};

const getPromotions = async () => {
    try {
        const promotions = await axios.get("http://localhost:8080/api/Discount/getDiscount");
        if (promotions.data && promotions.data.length > 0) {
            renderPromotions(promotions.data);
        } else {
            emptyPage("No promotions found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

getPromotions();