const jwt = require('jsonwebtoken');
const medicModel = require('../models/medic');
require('dotenv').config();

// getting medic dome data
const getMedicHomeData = async (req,res) => {
    try {
        const {medicID} = req.query;

        // getting medic informations for his home page
        medicModel.getMedicHomeData(medicID);

        // getting medic last 5 rows of his calendar for his home page
        medicModel.getMedicHomeCalander(medicID);

        // getting medic lsat 5 rows of his suivi patients for his home page
        medicModel.getMedicHomeClients(medicID);


        res.status(201).json({message: "medic home done"});
    } catch (error) {
        res.status(500).json({ message: 'Error getting medic home' });
    }
}

// getting medic calendar kaml
const getMedicCalendar = async (req, res) => {
    try {
        const {medicID} = req.query;

        //get calendar for the medic
        const calendar = medicModel.getMedicCalendar(medicID);

        res.status(201).json(calendar);
    } catch (error) {
        res.status(500).json({ message: 'Error getting medic calendar' });
    }
}

//getting medic suivi patients
const getMedicSuiviPatients = async (req, res) => {
    try {
        const {medicID} = req.query;

        //get suivi patients for the medic
        const suiviPatients = medicModel.getMedicSuiviPatients(medicID);

        res.status(201).json(suiviPatients);
    } catch (error) {
        res.status(500).json({ message: 'Error getting medic suivi patients' });
    }
}

//add a client to medic's suivi patients
const addClientToSuiviPatients = async (req, res) => {
    try {
        const {medicID, clientID} = req.body;
        const newSuiviPatient = await medicModel.addClientToSuiviPatients(medicID, clientID);
        console.log(newSuiviPatient);
        res.status(201).json(newSuiviPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error adding client to suivi patients' });
    }
}

//removing item from stock
const removeItemFromStock = async (req, res) => {
    try {
        const { itemID, count } = req.body;

        // Validate the input
        if (!itemID || !count || count <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Check if the item exists in the stock
        const item = await medicModel.checkItemIxistenceInStock(itemID);
        console.log(item);
        if (item.length == 0) {
            return res.status(404).json({ message: "Item not found in stock" });
        }
        console.log(count);
        // Subtract the quantity
        const updatedItem = await medicModel.removeItemFromStock(count, itemID);
        console.log("2");
        console.log(updatedItem);
        // Return the updated stock item
        res.status(200).json({ message: "Item successfully updated", item: updatedItem[0].quantity });
    } catch (error) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ message: "An error occurred while updating the stock" });
    }
};

module.exports = { getMedicHomeData, getMedicCalendar, getMedicSuiviPatients, addClientToSuiviPatients, removeItemFromStock};