
const Address = require('../Models/Address');
const User = require('../Models/User');

exports.getAllUsers = async (req, res) => {
    try {
        if (!req.session.userId) {
            throw { message: 'Authentication fail' };
        }
        const userData = await User.find({});
        return res.status(200).json(userData);

    }
    catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.addUser = async (req, res) => {
    try {

        const newUser = new User(req.body);
        await newUser.save();
        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addUserWithAddress = async (req, res) => {
    try {

        const newUser = new User({ ...req.body.user });
        const newAddress = new Address({ ...req.body.address });
        await newAddress.save();
        newUser.push(newAddress);
        await newUser.save();
        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Input validation
        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        // Updating the user data
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        // If user not found
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Sending the updated user data
        res.status(200).send(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

// wait for payment method  shopping cart
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        const user = await User.findById(id);

        // Delete all addresses associated with the user
        await Address.deleteMany(
            {
                id: { $in: user.address }
            });

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

