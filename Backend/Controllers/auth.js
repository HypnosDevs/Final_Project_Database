// const Address = require('../Models/Address');
// const User = require('../Models/User');
// const bcrypt = require('bcrypt');


// exports.checkMatch = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = await User.findOne({ username: username });
//         if (!user) {
//             // User not found
//             res.json({ isValid: false });
//         } else {
//             // User found, compare passwords
//             const validate = await bcrypt.compare(password, user.password);
//             res.json({ isValid: validate });
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// };

// exports.currentUser = async (req, res) => {
//     try {
//         //const user = await User.findById(req.session.userId);
//         console.log("session getuser", req.session.userId);
//         const userid = req.session.userId;
//         res.status(200).send(userid);
//     } catch (error) {
//         console.error('An error occurred:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// };

// exports.register = async (req, res) => {
//     try {
//         const { username, password } = req.body.user;
//         const user = await User.find({ username: username });
//         if (user.length > 0) {
//             return res.status(400).send({ message: "This usesername has been already used" })
//         }

//         const hash = await bcrypt.hash(password, 10);
//         req.body.user.password = hash;


//         const userData = new User(req.body.user);
//         const addressData = new Address(req.body.address);
//         req.body.address.user = userData;
//         userData.address.push(addressData);

//         await userData.save();
//         await addressData.save();
//         res.status(201).send({ message: "register successful" });


//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// /*
// Sample data
// {
//     "username": "john_doe",
//     "password": "password123",
//     "firstname": "John",
//     "lastname": "Doe",
//     "email": "john.doe@example.com",
//     "gender": "Male"
// }

// */

// exports.login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username: username });

//         if (!user) {
//             return res.status(400).json({
//                 message: 'User not found'
//             });
//         }

//         // Validate password
//         const validate = await bcrypt.compare(password, user.password);
//         if (!validate) {
//             return res.status(400).json({
//                 message: 'Invalid username or password'
//             });
//         }

//         req.session.userId = user.id;

//         console.log("session login", req.session.userId);

//         res.status(200).send({
//             message: 'Login successful',
//             username: user.username
//         });

//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// /*
// Sample login
// {
//     "username": "john_doe",
//     "password": "password123",
// }

// */

// exports.logout = async (req, res) => {
//     try {

//         req.session.userId = null;

//         res.status(200).json({
//             message: 'Logout successful',
//             username: user.username,
//         });

//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.checkUsername = async (req, res) => {
//     const { username } = req.body;
//     try {
//         const user = await User.findOne({ username: username });
//         if (!user) {
//             // Username not found
//             res.json({ exists: false });
//         } else {
//             // Username found
//             res.json({ exists: true });
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// };


const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const { pool } = require('../db/db.js');

// Check if username and password match
exports.checkMatch = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (rows.length === 0) {
            // User not found
            res.json({ isValid: false });
        } else {
            // User found, compare passwords
            const user = rows[0];
            const validate = await bcrypt.compare(password, user.password);
            res.json({ isValid: validate });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Get current user from session
exports.currentUser = async (req, res) => {
    try {
        console.log("session getuser", req.session.userId);
        const userId = req.session.userId;
        res.status(200).send(userId);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body.user;
        const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(400).send({ message: "This username has been already used" });
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO user (username, password, firstname, lastname, gender, email, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [username, hash, req.body.user.firstname, req.body.user.lastname, req.body.user.gender, req.body.user.email, req.body.user.user_role]);

        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        const userData = userRows[0];

        const { address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no } = req.body.address;

        await pool.query('INSERT INTO address (user_id, address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userData.user_id, address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no]);

        res.status(201).send({ message: "Register successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        const user = rows[0];

        // Validate password
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

        req.session.userId = user.user_id;

        console.log("session login", req.session.userId);

        res.status(200).send({
            message: 'Login successful',
            username: user.username
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

// Logout user
exports.logout = async (req, res) => {
    try {
        req.session.userId = null;
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

// Check if username exists
exports.checkUsername = async (req, res) => {
    const { username } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (rows.length === 0) {
            // Username not found
            res.json({ exists: false });
        } else {
            // Username found
            res.json({ exists: true });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};