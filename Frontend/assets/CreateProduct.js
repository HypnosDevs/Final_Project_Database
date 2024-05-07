const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#form-create-product");

submitButton.addEventListener("click", async () => {
    try {
        const formData = new FormData(form);

        for (item of formData) {
            if(item[0] == 'category' && item[1] != '') {
                const categories = item[1].split(' ');
                for (let i = 0; i < categories.length; i++) {
                    fetch(`http://localhost:8080/api/Category/addCategory/${categories[i]}`, {
                        method: "POST"
                    });
                }
            }
        };

        fetch('http://localhost:8080/api/Product/addProduct', {
            method: "POST",
            body: formData
        })

        location.replace("http://localhost:9090/product_admin")

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });

    }
});