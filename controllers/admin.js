const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin');
require('dotenv').config();

// getting admin home page data
const getAdminHomeData = async (req,res) => {
    try {
        const {adminID} = req.query;

        // getting admin informations for his gome page
        adminModel.getAdminHomeData(adminID);

        //get medics for admin's home page
        adminModel.getMedics();

        //get stock for admin's home page
        adminModel.getStock();

        res.status(201).json({message: "Admin home done"});
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin home' });
    }
}

// getting all medics for the admin
const getAdminMedics = async (req, res) => {
    try {
        const {adminID} = req.query;

        // get all medics
        const medics = await adminModel.getAdminMedics();

        res.status(201).json(medics);
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin medics' });
    }
}

// getting all stock for the admin
const getAdminStock = async (req, res) => {
    try {
        const {adminID} = req.query;

        // get all stock
        const stock = await adminModel.getAdminStock();

        res.status(201).json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin stock' });
    }
}


// adding a medic to the cabinet
const addMedic = async (req, res) => {
    try {
        const {firstName, lastName, email, password, phoneNumber} = req.body;

        // add the medic to the cabinet
        const newMedic = await adminModel.addMedic(firstName, lastName, email, password, phoneNumber);

        res.status(201).json(newMedic);
    } catch (error) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ message: 'Error adding medic to medics table' });
    }
}

// adding item to stock
const addItemToStock = async (req, res) => {
    try {
        const {itemName, quantity, description} = req.body;

        //adding the new item
        const newItem = await adminModel.addItemToStock(itemName, quantity, description);

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ message: 'Error getting admin stock' });
    }
}
module.exports = { getAdminHomeData, getAdminMedics, getAdminStock, addMedic, addItemToStock};