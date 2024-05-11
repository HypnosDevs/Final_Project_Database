const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#form-create-promotion");

submitButton.addEventListener("click", async () => {
    try {
        const formData = new FormData(form);
        let categoriesId = [];

        for (item of formData) {
            // console.log(item[0], item[1])
            if (item[0] == 'category' && item[1] != '') {
                const categories = item[1].split(' ');
                for (let i = 0; i < categories.length; i++) {
                    const category = await axios.post(`http://localhost:8080/api/Category/addCategory/${categories[i]}`);
                    categoriesId.push(category.data._id);
                }
            }
        };

        const discount = await axios.post('http://localhost:8080/api/Discount/addDiscount', {
            discount: Array.from(formData)[0][1],
            min_price: Array.from(formData)[2][1],
            max_discount: Array.from(formData)[3][1]
        })


        for (const categoryId of categoriesId) {
            const discountCategory = await axios.post('http://localhost:8080/api/DiscountCategory/addDiscountCategory', {
                categoryId: categoryId,
                discountId: discount.data._id
            })
        }

        location.replace("http://localhost:9090/promotion_admin");

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });

    }
});