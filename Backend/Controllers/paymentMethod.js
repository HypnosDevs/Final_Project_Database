


const PaymentMethod = require('../Models/PaymentMethod.js');
const PaymentType = require('../Models/PaymentType.js')
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
        const { id } = req.params;
        const data = await User.findById(id, { password: 0 }).populate('paymentmethod');
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
        const { id } = req.params;
        const user = await User.findById(id);
        const paymentType = await PaymentType.findOne({ name: req.body.type })
        const newPaymentMethod = new PaymentMethod(req.body);

        console.log('req.body', req.body)
        console.log('paymentType', paymentType)

        user.paymentmethod.push(newPaymentMethod);
        paymentType.paymentmethod.push(newPaymentMethod);
        await newPaymentMethod.save();
        await user.save();
        await paymentType.save();
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

        await User.findOneAndUpdate(
            { paymentmethod: id },
            { $pull: { paymentmethod: id } },
            { new: true }
        );

        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}