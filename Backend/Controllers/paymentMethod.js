const PaymentMethod = require('../Models/PaymentMethod.js');
const User = require('../Models/User.js')

exports.getAllPaymentMethod = async (req, res) => {
    try {
        const data = await PaymentMethod.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getAllPaymentMethodFromUser = async (req, res) => {
    try {
        const data = await User.findById(req.session.userId).populate('paymentmethod');
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PaymentMethod.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addPaymentMethod = async (req, res) => {
    try {
        const newPaymentMethod = new PaymentMethod(req.body);
        await newPaymentMethod.save();
        res.send(newPaymentMethod);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PaymentMethod.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        await data.save();
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await PaymentMethod.deleteOne({ _id: id })
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}