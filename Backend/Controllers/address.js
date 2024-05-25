const mysql = require('mysql2/promise');

const { pool } = require('../db/db.js');

// Get all addresses of a user
exports.getAllAddressFromUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM address WHERE user_id = ?', [user_id]);
        res.status(200).send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get a single address by ID
exports.getAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM address WHERE address_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send(rows[0]);
    } catch (err) {
        console.error("Error while fetching address:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};

// Add a new address for a user
exports.addAddress = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [userRows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        
        if (userRows.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        const {
            address_name, province, district, sub_district, street_number, address_line1,
            address_line2, city, postal_code, country, tel_no
        } = req.body;

        await pool.query(
            'INSERT INTO address (user_id, address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country_name, tel_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country, tel_no]
        );

        res.status(201).send({ message: "Address added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Update an address by ID
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            address_name, province, district, sub_district, street_number, address_line1,
            address_line2, city, postal_code, country, tel_no
        } = req.body;

        const [result] = await pool.query(
            'UPDATE address SET address_name = ?, province = ?, district = ?, sub_district = ?, street_number = ?, address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country_name = ?, tel_no = ? WHERE address_id = ?',
            [address_name, province, district, sub_district, street_number, address_line1, address_line2, city, postal_code, country, tel_no, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send({ message: "Address updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Delete an address by ID
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM address WHERE address_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send({ message: "Address deleted successfully" });
    } catch (err) {
        console.error("Error while deleting address:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};