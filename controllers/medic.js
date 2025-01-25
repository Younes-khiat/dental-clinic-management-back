const jwt = require('jsonwebtoken');
const medicModel = require('../models/medic');
const clientModel = require('../models/client');
require('dotenv').config();

// getting medic dome data
const getMedicHomeData = async (req,res) => {
    const getClientById = async (item, one) => {
        let result = await clientModel.findMedicById(item.client_id);
        if (one) {
            return {...result, detail: item.detail};

        } 
        console.log("rahi wa3ra");

        return {...result, detail: item.detail, next_session: item.next_session};
    }
    try {
        //get the dentistId from the cookie
        const medicCookie = req.cookies.user_data;
        if (!medicCookie) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        const medicData = JSON.parse(medicCookie);
        const medicID = medicData.id;
        const selectedDate = req.query.date || new Date().toLocaleDateString().split('T')[0]; // Default to today


        // getting medic informations for his home page
        const medicHomeInfo = (await medicModel.getMedicHomeData(medicID)).rows;

        // getting medic last 5 rows of his calendar for his home page
        const medicHomeCalendarGlobal = (await medicModel.getMedicHomeCalander(medicID, selectedDate)).rows;
        console.log("B: "+medicHomeCalendarGlobal);
        const medicHomeCalendar = await Promise.all(medicHomeCalendarGlobal.map((item) => getClientById(item, true)));
        console.log("A");
        // getting medic lsat 5 rows of his suivi patients for his home page
        const medicHomeSpecialsGlobal = (await medicModel.getMedicHomeClients(medicID)).rows;
        console.log(medicHomeSpecialsGlobal);
        const medicHomeSpecials = await Promise.all(medicHomeSpecialsGlobal.map((item) => getClientById(item, false)));
        console.log(medicHomeSpecials);

        const medicHomeData = {
            medicHomeCalendar: medicHomeCalendar,
            medicHomeInfo: medicHomeInfo,
            medicHomeSpecials: medicHomeSpecials
        }
        console.log("AAA: "+medicHomeData.medicHomeCalendar);
        res.status(201).json(medicHomeData);
    } catch (error) {
        res.status(500).json({ message: 'Error getting medic home' });
    }
}

// getting medic calendar kaml
const getMedicCalendar = async (req, res) => {
    try {
        const {medicID} = req.query;

        //get calendar for the medic
        const calendar = await medicModel.getMedicCalendar(medicID);

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
        const suiviPatients = await medicModel.getMedicSuiviPatients(medicID);

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

        if (item.length == 0) {
            return res.status(404).json({ message: "Item not found in stock" });
        }

        // Subtract the quantity
        const updatedItem = await medicModel.removeItemFromStock(count, itemID);

        // Return the updated stock item
        res.status(200).json({ message: "Item successfully updated", item: updatedItem[0].quantity });
    } catch (error) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ message: "An error occurred while updating the stock" });
    }
};

module.exports = { getMedicHomeData, getMedicCalendar, getMedicSuiviPatients, addClientToSuiviPatients, removeItemFromStock};