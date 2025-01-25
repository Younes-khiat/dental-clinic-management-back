const pool = require('../db');

// getting client's informations for his home page
const getClientHomeData = async (clientID) => {
    return (await pool.query('SELECT * FROM clients WHERE id = $1 LIMIT 1',[clientID]));
}

// getting cabinet info gor desplaying it
const getCabinetInfo = async () => {
    return (await pool.query('SELECT * from cabinet info'));
}

// find a medic by his name
const findMedicByName = async (firstName, lastName) => {
    return (((await pool.query('SELECT * FROM medics WHERE first_name = $1 AND last_name = $2 LIMIT 1', [firstName, lastName])).rows[0]));
}

//find a client by his ID
const findMedicById = async (id) => {
    return (((await pool.query('SELECT * FROM clients WHERE id = $1 LIMIT 1', [id])).rows[0]));
}

// reserving for a client
const reserve = async (clientID, medicID, date, description) => {
    return (((await pool.query('INSERT INTO calendars (client_id, medic_id, date, detail) VALUES ($1, $2, $3, $4) RETURNING *', [clientID, medicID, date, description])).rows[0]));
}

//getting dates reserved by clients
const getDates = async (clientID) => {
    return (((await pool.query('SELECT * FROM calendars WHERE client_id = $1',[clientID]))))
}
module.exports = { getClientHomeData, getCabinetInfo, findMedicByName, reserve, getDates, findMedicById};