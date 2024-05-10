const PaymentType = require('../Models/PaymentType.js');

exports.getAllPaymentType = async (req, res) => {
    try {
        const data = await PaymentType.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getPaymentTypeFromUserPaymentMethod = async (req, res) => {
    try {
        const { payment_method_id } = req.params;
        const data = await PaymentType.findOne({ paymentmethod: { $in: payment_method_id } });
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}


exports.getPaymentType = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PaymentType.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addPaymentType = async (req, res) => {
    try {
        const existingPaymentType = await PaymentType.find({ name: req.body.type });

        if (existingPaymentType.length === 0) {
            const newPaymentType = new PaymentType(req.body);
            await newPaymentType.save();
            res.send(newPaymentType);

        } else {
            res.status(400).send({ message: "PaymentType already exists" });
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deletePaymentType = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PaymentType.deleteOne({ _id: id })
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}