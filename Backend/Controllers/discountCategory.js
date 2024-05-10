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

exports.getDiscountCategoryByDiscountId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await DiscountCategory.find({ discount:id })
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
        await category.save()
        await discount.save()
        res.send();

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteDiscountCategoryByDiscountId = async (req, res) => {
    try {
        const { id } = req.params;
        const discountCategories = await DiscountCategory.find({ discount: id })
        for (let i = 0; i < discountCategories.length; i++) {
            discountCategories[i] = discountCategories[i]._id;
        }
        
        await DiscountCategory.deleteMany({ discount: id })

        // Remove the reference from the shopping cart model
        for (let i = 0; i < discountCategories.length; i++) {
            await Category.updateOne(
                { discountcategory: discountCategories[i] },
                { $pull: { discountcategory: discountCategories[i] } },
                { new: true }
            );
        }

        res.send()

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