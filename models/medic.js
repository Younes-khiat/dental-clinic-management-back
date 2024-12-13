const pool = require('../db');

// get from DB medic infos for his home page
const getMedicHomeData = async (medicID) => {
    return (await pool.query('SELECT * FROM medics WHERE id = $1 LIMIT 1',[medicID]));
}

// get 5 rows of medic's calendar
const getMedicHomeCalander = async (medicID) => {
    const now = new Date().toISOString().split('T')[0];
    return (await pool.query(`SELECT * FROM calendars WHERE medic_id = $1 AND DATE(date) = DATE($2) ORDER BY date ASC LIMIT 5;`,[medicID, now]));
}

// get 5 rows of medic's suivi patiet for his home page
const getMedicHomeClients = async (medicID) => {
    return ((await pool.query('SELECT * FROM suivi_patients WHERE medic_id = $1 ORDER BY next_session ASC LIMIT 5', [medicID])).rows);
}

//get all calendar for the medic
const getMedicCalendar = async (medicID) => {
    return ((await pool.query('SELECT * FROM calendars WHERE medic_id = $1 ORDER BY date', [medicID])).rows);
}

//get all suivi patients for the medic
const getMedicSuiviPatients = async (medicID) => {
  return ((await pool.query('SELECT * FROM suivi_patients WHERE medic_id = $1 ORDER BY next_session', [medicID])).rows);
}

// adding new client to medic suivi patients
const addClientToSuiviPatients = async (medicID, clientID) => {
  return (
    await pool.query(
      'INSERT INTO suivi_patients (description, client_id, medic_id, next_session) VALUES ($1, $2, $3, $4) RETURNING *',
      ["ggggggg", clientID, medicID, "2024-12-30 14:30:00"]
    )
  ).rows;
  }

// Check if the item exists in the stock
  const checkItemIxistenceInStock = async (itemID) => {
    return ((await pool.query('SELECT * FROM stock WHERE id = $1',[itemID])).rows);
}

// removing item from stock
const removeItemFromStock = async (count, itemID) => {
  return ((await pool.query('UPDATE stock SET quantity = quantity - $1 WHERE id = $2 RETURNING *',[count, itemID])).rows);
}
module.exports = { getMedicHomeData, getMedicHomeCalander, getMedicHomeClients, getMedicCalendar, getMedicSuiviPatients, addClientToSuiviPatients, checkItemIxistenceInStock, removeItemFromStock};