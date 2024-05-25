const emptyPage = (text) => {
    // console.log(document.querySelector('.no-product'))
    let h1Element = document.querySelector('.no-product');
    if (h1Element) {
        h1Element.textContent = `${text}`;
        return;
    }
    const trList = document.querySelectorAll("#board tbody tr");
    trList.forEach(tr => {
        tr.remove();
    });

    // Create an h1 element with the text "No products found" and class "no-product"
    h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const boardHeaderSection = document.getElementById('board');
    const referenceNode = boardHeaderSection.nextElementSibling;

    // Insert the h1 element after the page-header section
    boardHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
}

const deletePromotion = async (discount_id, category_id) => {

    try {
        // Delete the discount category from the server
        // await axios.delete(`http://localhost:8080/api/DiscountCategory/${discount_id}/deleteDiscountCategoryByDiscountId`);

        // Delete the discount from the server
        await axios.delete(`http://localhost:8080/api/DiscountCategory/deleteDiscountCategoryById/${discount_id}/${category_id}`);

        // Remove all td elements inside the corresponding row from the cart table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${discount_id}${category_id}"]`);
        if (rowToRemove) {
            const cellsToRemove = rowToRemove.querySelectorAll('td');
            cellsToRemove.forEach(cell => {
                cell.remove(); // Remove each td element from the row
            });

            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for promotion:', discount_id);
        }


        const promotionsCount = document.querySelectorAll('#cart tbody tr').length;
        if (promotionsCount === 0) {
            emptyPage("No promotions found");
        }
    } catch (error) {
        console.error('Error deleting promotion:', error);
    }
};

const deleteDiscount = async (discount_id) => {
    try {
        // Delete the discount and associated categories from the server
        await axios.delete(`http://localhost:8080/api/Discount/deleteDiscount/${discount_id}`);
        await axios.delete(`http://localhost:8080/api/DiscountCategory/deleteDiscountCategoryByDiscountId/${discount_id}`);

        // Remove the corresponding row from the HTML table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${discount_id}"]`);
        if (rowToRemove) {
            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for discount:', discount_id);
            return; // Exit function if row not found
        }

        // Check if there are no discounts left in the table
        const discountCount = document.querySelectorAll('#cart tbody tr').length;
        if (discountCount === 0) {
            emptyPage("No Discount found");
        }
    } catch (error) {
        console.error('Error deleting Discount:', error);
    }
};

const deleteCategory = async (category_id) => {
    try {
        // Delete the discount and associated categories from the server
        await axios.delete(`http://localhost:8080/api/Category/deleteCategory/${category_id}`);
        await axios.delete(`http://localhost:8080/api/DiscountCategory/deleteDiscountCategoryByCategoryId/${category_id}`);

        // Remove the corresponding row from the HTML table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${category_id}"]`);
        if (rowToRemove) {
            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for category', category_id);
            return; // Exit function if row not found
        }

        // Check if there are no discounts left in the table
        const categoryCount = document.querySelectorAll('#cart tbody tr').length;
        if (categoryCount === 0) {
            emptyPage("No Category found");
        }
    } catch (error) {
        console.error('Error deleting Category:', error);
    }
};

const renderPromotions = async (promotions) => {
    const headerTable = document.querySelector("#header-table thead");
    headerTable.innerHTML = ''; // Clear header

    // Create header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <td>Remove</td>
        <td>Discount</td>
        <td>Category</td>
        <td>Edit</td>
    `;
    headerTable.appendChild(headerRow);

    const tableBody = document.querySelector("#board tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through promotions array
    for (const promotion of promotions) {
        try {
            // Fetch discount categories for the current promotion
            const discountCats = await axios.get(`http://localhost:8080/api/DiscountCategory/getDiscountCategoryByDiscountId/${promotion.discount_id}`);

            // Iterate through each category
            for (const dataDiscountCats of discountCats.data) {
                const category_id = dataDiscountCats.category_id;

                // Fetch category name using category_id
                const categoryName = await axios.get(`http://localhost:8080/api/Category/getCategory/${category_id}`);

                // Create row for each category
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href=""><i class="fa-solid fa-circle-xmark" onclick="deletePromotion('${promotion.discount_id}','${category_id}')"></i></a></td>
                    <td>${promotion.discount}%</td>
                    <td>${categoryName.data.category_name}</td>
                    <td class="edit"><a href="/edit_promotion/${promotion.discount_id}">Edit</a></td>
                `;
                row.setAttribute('id', `${promotion.discount_id}${category_id}`);
                tableBody.appendChild(row);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors here (e.g., display an error message in UI)
        }
    }

    // Update discounts length count
    const promotionCount = document.querySelectorAll('#board tbody tr').length;
    const promotionLength = document.querySelector("#promotions-length");
    promotionLength.innerHTML = promotionCount;

    // Display message if no promotions found
    if (promotionCount === 0) {
        emptyPage("No Promotion found");
    } else {
        // Remove "no-product" message if it exists
        const countNoProduct = document.querySelector('.no-product');
        if (countNoProduct) {
            countNoProduct.remove();
        }
    }
};

const renderDiscounts = async (discounts) => {
    const headerTable = document.querySelector("#header-table thead");
    headerTable.innerHTML = ''; // Clear header

    // Create header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <td>Remove</td>
        <td>Discount</td>
        <td>Min Price</td>
        <td>Max Price</td>
        <td>Edit</td>
    `;
    headerTable.appendChild(headerRow);

    const tableBody = document.querySelector("#board tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through promotions array
    for (const discount of discounts) {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td><a href=""><i class="fa-solid fa-circle-xmark" onclick="deleteDiscount('${discount.discount_id}')"></i></a></td>
                <td>${discount.discount}%</td>
                <td>${discount.min_price}</td>
                <td>${discount.max_discount}</td>
                <td class="edit"><a href="/edit_promotion/${discount.discount_id}">Edit</a></td>
            `;
        row.setAttribute('id', `${discount.discount_id}`);
        tableBody.appendChild(row);

    }

    // Update discounts length count
    const discountCount = document.querySelectorAll('#board tbody tr').length;
    const discountLength = document.querySelector("#discounts-length");
    discountLength.innerHTML = discountCount;

    // Display message if no promotions found
    if (discountCount === 0) {
        emptyPage("No Discount found");
    } else {
        // Remove "no-product" message if it exists
        const countNoProduct = document.querySelector('.no-product');
        if (countNoProduct) {
            countNoProduct.remove();
        }
    }
};

const renderCategories = async (categories) => {
    const headerTable = document.querySelector("#header-table thead");
    headerTable.innerHTML = ''; // Clear header

    // Create header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <td style="width: 150px;">Remove</td>
        <td style="width: 150px;">Name</td>
        <td style="width: 150px;">Edit</td>
    `;
    headerTable.appendChild(headerRow);

    const tableBody = document.querySelector("#board tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through promotions array
    for (const category of categories) {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td><a href=""><i class="fa-solid fa-circle-xmark" onclick="deleteCategory('${category.category_id}')"></i></a></td>
                <td>${category.category_name}</td>

                <td class="edit"><a href="/edit_promotion/${category.category_id}">Edit</a></td>
            `;
        row.setAttribute('id', `${category.category_id}`);
        tableBody.appendChild(row);

    }

    // Update discounts length count
    const categoryCount = document.querySelectorAll('#board tbody tr').length;
    const categoryLength = document.querySelector("#categories-length");
    categoryLength.innerHTML = categoryCount;

    // Display message if no promotions found
    if (categoryCount === 0) {
        emptyPage("No Category found");
    } else {
        // Remove "no-product" message if it exists
        const countNoProduct = document.querySelector('.no-product');
        if (countNoProduct) {
            countNoProduct.remove();
        }
    }
};

const getPromotions = async (promotions) => {
    try {
        if (promotions.data && promotions.data.length > 0) {
            renderPromotions(promotions.data);
        } else {
            emptyPage("No promotions found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

