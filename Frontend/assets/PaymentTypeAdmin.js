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

const deletePaymentType = async (payment_type_id) => {
    try {
        const paymentType = await axios.get(`http://localhost:8080/api/PaymentType/getPaymentType/${payment_type_id}`);

        // Delete the payment type from the server
        await axios.delete(`http://localhost:8080/api/PaymentType/${payment_type_id}/deletePaymentType`);

        // Remove all td elements inside the corresponding row from the cart table
        const rowToRemove = document.querySelector(`#cart tbody tr[id="${payment_type_id}"]`);
        if (rowToRemove) {
            const cellsToRemove = rowToRemove.querySelectorAll('td');
            cellsToRemove.forEach(cell => {
                cell.remove(); // Remove each td element from the row
            });

            rowToRemove.remove(); // Remove the row from the DOM
        } else {
            console.error('Row not found for payment type:', payment_type_id);
        }

        const paymentTypesCount = document.querySelectorAll('#cart tbody tr').length;
        if (paymentTypesCount === 0) {
            emptyPage("No payment type found");
        }
    } catch (error) {
        console.error('Error deleting payment type:', error);
    }
};

const renderPaymentTypes = (paymentTypes) => {
    const tbody = document.querySelector('#cart tbody');
    tbody.innerHTML = ''; // Clear existing content

    paymentTypes.forEach(paymentType => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#"><i class="fa-solid fa-circle-xmark" onclick="deletePaymentType('${paymentType.payment_type_id}')"></i></a></td>
            <td>${paymentType.payment_name}</td>
        `;
        row.setAttribute('id', paymentType.payment_type_id);
        tbody.appendChild(row);
    });
};

const getPaymentTypes = async () => {
    try {
        
        const paymentTypes = await axios.get("http://localhost:8080/api/PaymentType/getPaymentType");
        if (paymentTypes.data && paymentTypes.data.length > 0) {
            renderPaymentTypes(paymentTypes.data);
        } else {
            emptyPage("No payment type found");
        }

    } catch (error) {
        emptyPage(`${error}`)

    }
};

// getPaymentTypes();


