
const User = require('../Models/User');
const bcrypt = require('bcrypt');


// example allowedRoles = ['admin','product manager']
exports.checkUserRole = (allowedRoles) => {
    return (req, res, next) => {

        const userRole = req.session.user.role;
        if (allowedRoles.includes('ADMIN')) {
            return next();
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'You do not have permission to access this resource.' });
        }


        return next();
    };
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({ username: username });
    if (user.length > 0) {
        return res.status(400).send({ message: "Already register" })
    }

    const hash = await bcrypt.hash(password, 10);
    req.body.password = hash;

    try {

        const userData = new User(req.body);
        await userData.save();
        res.send(userData);

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
        req.session.user = user;

        res.status(200).json({
            message: 'Login successful',
            username: user.username,
            role: user.role
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

exports.getUsers = async (req, res) => {
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