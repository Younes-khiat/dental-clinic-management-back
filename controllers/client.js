const jwt = require('jsonwebtoken');
const clientModel = require('../models/client');
require('dotenv').config();

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

module.exports = { getClientHomeData};