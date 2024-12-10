const pool = require('../db');

const getClientHomeData = async (clientID) => {
    return (await pool.query('SELECT * FROM clients WHERE id = $1 LIMIT 1',[clientID]));
}
const getCabinetInfo = async () => {
    return (await pool.query('SELECT * from cabinet info'));
}

module.exports = { getClientHomeData, getCabinetInfo};