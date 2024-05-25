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
            address_name, province, amphoe, district, address_line1,
            address_line2, postal_code, country, tel_no
        } = req.body;

        await pool.query(
            'INSERT INTO address (user_id, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name, tel_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country, tel_no]
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
            address_name, province, amphoe, district,address_line1,
            address_line2, postal_code, country_name, tel_no
        } = req.body;

        let updateQuery = `UPDATE address SET`;
        let updateValue = [];

        if (address_name !== undefined) updateQuery += ' address_name = ?,', updateValue.push(address_name);
        if (address_line1 !== undefined) updateQuery += ' address_line1 = ?,', updateValue.push(address_line1);
        if (address_line2 !== undefined) updateQuery += ' address_line2 = ?,', updateValue.push(address_line2);
        if (country_name !== undefined) updateQuery += ' country_name = ?,', updateValue.push(country_name);
        if (province !== undefined) updateQuery += ' province = ?,', updateValue.push(province);
        if (amphoe !== undefined) updateQuery += ' amphoe = ?,', updateValue.push(amphoe);
        if (district !== undefined) updateQuery += ' district = ?,', updateValue.push(district);
        if (postal_code !== undefined) updateQuery += ' postal_code = ?,', updateValue.push(postal_code);
        if (tel_no !== undefined) updateQuery += ' tel_no = ?,', updateValue.push(tel_no);

        if (updateQuery.slice(-1) === ',') updateQuery = updateQuery.slice(0, -1);
        else {
            return res.status(200).send({ message: 'Address update nothing'});
        }
        updateQuery += ' WHERE address_id = ?';
        updateValue.push(id);

        const [result] = await pool.query(updateQuery, updateValue);

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