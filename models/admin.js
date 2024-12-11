const pool = require('../db');

const getAdminHomeData = async (adminID) => {
    return (await pool.query('SELECT * FROM admins WHERE id = $1 LIMIT 1',[adminID]));
}
const getMedics = async () => {
    return (await pool.query('SELECT * from medics LIMIT 5'));
}
const getStock = async () => {
    return (await pool.query('SELECT * from stock LIMIT 5'));
}

module.exports = { getAdminHomeData, getMedics, getStock};