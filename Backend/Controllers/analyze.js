
const Order = require("../Models/Order");
const OrderItem = require("../Models/OrderItem");
const mongoose = require("mongoose");
const User = require("../Models/User");

exports.bestCategory = async (req, res) => {
    try {

        const pipeline = [{
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'product.category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $group: {
                _id: {
                    categoryId: '$category._id',
                    categoryName: '$category.name'
                },
                totalQty: { $sum: '$qty' },
                totalSales: { $sum: { $multiply: ['$qty', '$price'] } }
            }
        },
        {
            $project: {
                _id: 0,
                categoryName: '$_id.categoryName',
                totalQty: 1,
                totalSales: 1
            }
        },
        {
            $sort: { totalQty: -1 }
        }];

        const data = await OrderItem.aggregate(pipeline);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }

}

exports.bestCategoryFromUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(user_id);
        const pipeline = [
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: '_id',
                    foreignField: 'order',
                    as: 'orderItems'
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $group: {
                    _id: {
                        categoryId: '$category._id',
                        categoryName: '$category.name'
                    },
                    totalQty: { $sum: '$orderItems.qty' },
                    totalSales: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    user: '$_id.user',
                    categoryId: '$_id.categoryId',
                    categoryName: '$_id.categoryName',
                    totalQty: 1,
                    totalSales: 1
                }
            },
            {
                $sort: { totalQty: -1 }
            }
        ];


        const data = await Order.aggregate(pipeline);
        // data = { "test": "test" }
        console.log('here', data)
        res.status(200).send(data);
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

exports.getUserTotalSpending = async (req, res) => {
    try {
        const { user_id } = req.params;

        const pipeline = [
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "_id",
                    foreignField: "order",
                    as: "orderItems"
                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $group: {
                    _id: null,
                    totalSpending: {
                        $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] }
                    }
                }
            }
        ];

        const totalSpendingResult = await Order.aggregate(pipeline);


        res.status(200).send(totalSpendingResult);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getProductSold = async (req, res) => {
    try {


        const pipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            },
            {
                $group: {
                    _id: {
                        productId: '$product._id',
                    },
                    productName: { $first: '$product.name' },
                    totalQty: { $sum: '$qty' },
                    totalSales: { $sum: { $multiply: ['$qty', '$price'] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: '$_id.productId',
                    productName: 1,
                    totalQty: 1,
                    totalSales: 1
                }
            },
            {
                $sort: { totalQty: -1 }
            }
        ];

        const data = await OrderItem.aggregate(pipeline);

        res.status(200).send(data);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getBestProvince = async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'addresses',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'address'
                }
            },
            {
                $unwind: '$address'
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'orders'
                }
            },
            {
                $unwind: '$orders'
            },
            {
                $lookup: {
                    from: 'orderitems',
                    localField: 'orders._id',
                    foreignField: 'order',
                    as: 'orderItems'
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $group: {
                    _id: {
                        province: '$address.province',
                    },
                    totalQty: { $sum: '$orderItems.qty' },
                    totalSales: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    province: '$_id.province',
                    totalQty: 1,
                    totalSales: 1
                }
            },
            {
                $sort: { totalQty: -1 }
            }
        ];

        const data = await User.aggregate(pipeline);
        res.status(200).send(data);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
