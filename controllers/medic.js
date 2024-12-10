const jwt = require('jsonwebtoken');
const medicModel = require('../models/medic');
require('dotenv').config();

const getMedicHomeData = async (req,res) => {
    try {
        const {medicID} = req.query;
        medicModel.getMedicHomeData(medicID);
        medicModel.getMedicHomeCalander(medicID);
        medicModel.getMedicHomeClients(medicID);
        res.status(201).json({message: "medic home done"});
    } catch (error) {
        res.status(500).json({ message: 'Error getting client home' });
    }
}

module.exports = { getMedicHomeData};