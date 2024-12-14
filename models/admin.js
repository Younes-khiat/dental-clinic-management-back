const pool = require('../db');

//get admin information from DB to the home page
const getAdminHomeData = async (adminID) => {
    return (await pool.query('SELECT * FROM admins WHERE id = $1 LIMIT 1',[adminID]));
}

// get last 5 five recruited medics for admin home page
const getMedics = async () => {
    return (await pool.query('SELECT * FROM medics LIMIT 5'));
}

// get last 5 five modified items in the stock for admin home page
const getStock = async () => {
    return (await pool.query('SELECT * FROM stock LIMIT 5'));
}

// get all medics for admin
const getAdminMedics = async () => {
    return ((await pool.query('SELECT * FROM medics')).rows);
}

// get all stock for admin
const getAdminStock = async () => {
    return ((await pool.query('SELECT * FROM stock')).rows);
}

// add new medic to medics table in DB
const addMedic = async (firstName, lastName, email, password, phoneNumber) => {
    return ((await pool.query('INSERT INTO medics (first_name, last_name, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *', [firstName, lastName, email, password, phoneNumber])).rows);
}

// Inserting new item to stock
const addItemToStock = async (itemName, quantity, description) => {
    return ((await pool.query('INSERT INTO stock (item_name, quantity, description) VALUES ($1, $2, $3) RETURNING *', [itemName, quantity, description])).rows);
}
module.exports = { getAdminHomeData, getMedics, getStock, getAdminMedics, getAdminStock, addMedic, addItemToStock};