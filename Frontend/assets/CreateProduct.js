const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#form-create-product");

submitButton.addEventListener("click", async () => {
    try {
        let messages = []
        const formData = new FormData(form);
        console.log("formdata", formData)

        fetch('http://localhost:8080/api/Product/addProduct', {
            method: "POST",
            body: formData,
        })

        location.replace("http://localhost:9090/product_admin")

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });

    }
});