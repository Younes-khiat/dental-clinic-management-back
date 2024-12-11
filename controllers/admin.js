const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin');
require('dotenv').config();

const getAdminHomeData = async (req,res) => {
    try {
        const {adminID} = req.query;
        adminModel.getAdminHomeData(adminID);
        adminModel.getMedics();
        adminModel.getStock();
        res.status(201).json({message: "Admin home done"});
    } catch (error) {
        res.status(500).json({ message: 'Error getting client home' });
    }
}

module.exports = { getAdminHomeData};