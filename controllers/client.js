const jwt = require('jsonwebtoken');
const clientModel = require('../models/client');
require('dotenv').config();

//getting data needed for client's home page
const getClientHomeData = async (req,res) => {
    try {
        const {clientID} = req.query;
        clientModel.getClientHomeData(clientID);
        clientModel.getCabinetInfo();
        res.status(201).json({message: "clinet home done"});
    } catch (error) {
        res.status(500).json({ message: 'Error getting client home' });
    }
}

//reserving for a cient
const reserve = async (req, res) => {
    try {
        console.log(req.body);
        const date = req.body.date;
        console.log("11111 " + date);
        const {clientID, medicFirstName, medicLastName, description} = req.body;
        const {id} = await clientModel.findMedicByName(medicFirstName, medicLastName);
        if (!id) {
            res.status(500).json({message: 'medic not found'});
        }
        console.log("22");
        const reserved = await clientModel.reserve(clientID, id.toString(), date, description);
        res.status(201).json(reserved);
    } catch (error) {
        res.status(500).json({ message: 'Error reserving'+ error.message });
    }
}

//getting client's already taken dates
const getDates = async (req, res) => {
    try {
        const {clientID} = req.query;
        const dates = clientModel.getDates(clientID);
        res.status(201).json(dates);
    } catch (error) {
        res.status(500).json({ message: 'Error getting data' });
    }
}

module.exports = { getClientHomeData, reserve, getDates};