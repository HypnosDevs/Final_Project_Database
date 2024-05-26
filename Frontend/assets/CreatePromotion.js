const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#form-create-promotion");

submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        if (form.checkValidity()) {
            const formData = new FormData(form);
            let categoriesId = [];

            for (const item of formData) {
                if (item[0] === 'category' && item[1] !== '') {
                    const categories = item[1].split(' ');
                    for (const category of categories) {
                        const categoryResponse = await axios.post(`http://localhost:8080/api/Category/addCategory/${category}`);
                        categoriesId.push(categoryResponse.data.category_id);
                    }
                }
            }

            const updatedData = {
                discount: formData.get('discount'),
                min_price: formData.get('min_price'),
                max_discount: formData.get('max_discount')
            };

            const isExists = await axios.post(`http://localhost:8080/api/Discount/checkDiscountMatch`, updatedData);

            let discount;
            if (isExists.data.isExists === "0") {
                discount = await axios.post('http://localhost:8080/api/Discount/addDiscount', {
                    discount: updatedData.discount,
                    min_price: updatedData.min_price,
                    max_discount: updatedData.max_discount
                });
            } else {
                discount = isExists;
            }

            console.log(isExists);

            for (const category_id of categoriesId) {
                // console.log("category_id", category_id);
                const res = await axios.get(`http://localhost:8080/api/DiscountCategory/getDiscountCategoryByDiscountCategoryID/${discount.data.discount_id}/${category_id}`)
                if (res.data.length === 0) {
                    await axios.post('http://localhost:8080/api/DiscountCategory/addDiscountCategory', {
                        category_id: category_id,
                        discount_id: discount.data.discount_id
                    });
                }
            }

            location.replace("http://localhost:9090/promotion_admin");

        } else {
            throw "Please fill out all required fields.";

        }
    } catch (err) {
        let h1Ele = document.querySelector('.h1Ele');
        if (!h1Ele) {
            h1Ele = document.createElement("h1");
            h1Ele.textContent = `${err}`;
            h1Ele.style.color = "red";
            h1Ele.classList.add('h1Ele');

            form.appendChild(h1Ele);
        }
    }
});
