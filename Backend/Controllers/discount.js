const Discount = require('../Models/Discount.js');
const DiscountCategory = require('../Models/DiscountCategory.js');

exports.getAllDiscount = async (req, res) => {
    try {
        const data = await Discount.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getAllDiscountFromCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await DiscountCategory.findOne({ category: { _id: id } }).populate('discount');
        res.send(data);


    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Discount.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addDiscount = async (req, res) => {
    try {
        const newDiscount = new Discount(req.body);
        await newDiscount.save();
        res.send(newDiscount);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Discount.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        await data.save();
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Discount.deleteOne({ _id: id })
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}