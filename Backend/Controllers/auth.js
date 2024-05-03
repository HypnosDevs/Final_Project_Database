
const Address = require('../Models/Address');
const User = require('../Models/User');
const bcrypt = require('bcrypt');

exports.checkMatch = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            // User not found
            res.json({ isValid: false });
        } else {
            // User found, compare passwords
            const validate = await bcrypt.compare(password, user.password);
            res.json({ isValid: validate });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


exports.register = async (req, res) => {
    try {
        const { username, password } = req.body.user;
        const user = await User.find({ username: username });
        if (user.length > 0) {
            return res.status(400).send({ message: "This usesername has been already used" })
        }

        const hash = await bcrypt.hash(password, 10);
        req.body.password = hash;


        const userData = new User(req.body.user);
        const addressData = new Address(req.body.address);
        userData.address.push(addressData);
        await userData.save();
        await addressData.save();
        res.status(201).send({ message: "register successful" });


    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

/*
Sample data
{
    "username": "john_doe",
    "password": "password123",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "gender": "Male"
}

*/

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        // Validate password
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

        req.session.userId = user.id;

        res.status(200).json({
            message: 'Login successful',
            username: user.username
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

/*
Sample login
{
    "username": "john_doe",
    "password": "password123",
}

*/

exports.logout = async (req, res) => {
    try {

        req.session.userId = null;

        res.status(200).json({
            message: 'Logout successful',
            username: user.username,
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

