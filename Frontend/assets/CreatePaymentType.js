const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#form-create-payment_type");

submitButton.addEventListener("click", async () => {
    try {
        const formData = new FormData(form);

        const paymentType = await axios.post('http://localhost:8080/api/PaymentType/addPaymentType', {
            name: Array.from(formData)[0][1]
        })

        location.replace("http://localhost:9090/payment_type_admin");

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });

    }
});