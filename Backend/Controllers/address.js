const Address = require("../Models/Address");
const User = require("../Models/User");

exports.getAllAddressFromUser = async (req, res) => {
    try {
        const addressData = await User.findById(req.session.userId).populate('address');

        res.send(addressData);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findById(id);

        if (!address) {
            return res.status(404).send("Address not found");
        }

        res.status(200).send(address);
    } catch (err) {
        console.error("Error while fetching address:", err);
        res.status(500).send("Internal server error");
    }
};

exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const newAddress = new Address(req.body);
        user.address.push(newAddress);
        await user.save();
        await newAddress.save();
        res.status(201).send({ message: "Address added successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Address.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

        if (!data) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).send({ message: "Address updated successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAddress = await Address.findByIdAndDelete(id);

        if (!deletedAddress) {
            return res.status(404).send({ message: "Address not found" });
        }

        res.status(200).send({ message: "Address deleted successfully" });
    } catch (err) {
        console.error("Error while deleting address:", err);
        res.status(500).send({ message: "Internal server error" });
    }
}

