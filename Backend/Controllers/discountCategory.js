const Category =  require('../Models/Category.js')
const Discount = require('../Models/Discount.js');
const DiscountCategory = require('../Models/DiscountCategory.js');

exports.getAllDiscountCategory = async (req, res) => {
    try {
        const data = await DiscountCategory.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getDiscountCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await DiscountCategory.findById(id)
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addDiscountCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.body.categoryId);
        const discount = await Discount.findById(req.body.discountId);

        req.body.category = category;
        req.body.discount = discount;
        const newDiscountCategory = new DiscountCategory(req.body);

        category.discountcategory.push(newDiscountCategory);
        discount.discountcategory.push(newDiscountCategory);

        await newDiscountCategory.save();
        console.log('kuy')
        await category.save()
        console.log('kuy')
        await discount.save()
        console.log('kuy')
        res.send();

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteDiscountCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await DiscountCategory.deleteOne({ _id: id })
        res.send(data)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}