const bcrypt = require('bcrypt');
const { pool } = require('../db/db.js');


exports.adminRegister = async (req, res) => {
    try {
        const { username, password, firstname, lastname, email, gender } = req.body;

        // Check if username already exists
        const findUserQuery = `SELECT username FROM user WHERE username = ?`;
        const [existingUsers] = await pool.query(findUserQuery, [username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "This username has already been used" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin user
        const insertAdminQuery = `INSERT INTO user (username, password, firstname, lastname, gender, email, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.query(insertAdminQuery, [username, hashedPassword, firstname, lastname, gender, email, 'ADMIN']);

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error("Error in adminRegister:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, password, firstname, lastname, gender, email, user_role } = req.body.user;

        // Check if username already exists
        const findUserQuery = `SELECT * FROM user WHERE username = ?`;
        const [existingUsers] = await pool.query(findUserQuery, [username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "This username has already been used" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into user table
        const insertUserQuery = `
            INSERT INTO user (username, password, firstname, lastname, gender, email, user_role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const userValues = [username, hashedPassword, firstname, lastname, gender, email, user_role];
        await pool.query(insertUserQuery, userValues);

        // Retrieve the newly inserted user's ID
        const getUserIdQuery = `SELECT LAST_INSERT_ID() as user_id`;
        const [[{ user_id }]] = await pool.query(getUserIdQuery);

        // Handle address creation
        const { address_name, province, amphoe, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no } = req.body.address;

        const insertAddressQuery = `
            INSERT INTO address (user_id, address_name, province, amphoe, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const addressValues = [user_id, address_name, province, amphoe, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no];
        await pool.query(insertAddressQuery, addressValues);

        // Handle payment method creation
        const { payment_type, account_number, payment_expiry_date } = req.body.payment;

        // Check if payment type exists or insert it if not
        let findPaymentTypeQuery = `SELECT id FROM payment_type WHERE payment_name = ?`;
        let [paymentTypeRows] = await pool.query(findPaymentTypeQuery, [payment_type]);

        let payment_type_id;
        if (paymentTypeRows.length === 0) {
            throw "Payment type not define"
        } else {
            payment_type_id = paymentTypeRows[0].id;
        }

        const insertPaymentMethodQuery = `
            INSERT INTO user_payment_method (user_id, payment_type_id, account_number, payment_expiry_date)
            VALUES (?, ?, ?, ?)
        `;
        const paymentMethodValues = [user_id, payment_type_id, account_number, payment_expiry_date];
        await pool.query(insertPaymentMethodQuery, paymentMethodValues);

        res.status(201).json({ message: "User registration successful" });
    } catch (err) {
        console.error("Error in addUser:", err);
        res.status(500).json({ message: err.message });
    }
};



