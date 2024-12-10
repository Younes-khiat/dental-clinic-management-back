const pool = require('../db');

const getMedicHomeData = async (medicID) => {
    return (await pool.query('SELECT * FROM medics WHERE id = $1 LIMIT 1',[medicID]));
}
const getMedicHomeCalander = async (medicID) => {
    const now = new Date().toISOString().split('T')[0];
    return (await pool.query(`
    SELECT *
    FROM calendars
    WHERE medic_id = $1
      AND DATE(date) = DATE($2)
    ORDER BY date ASC
    LIMIT 5;
  `,[medicID, now]));
}
const getMedicHomeClients = async (medicID) => {
    return (await pool.query('SELECT * FROM suivi_patients WHERE medic_id = $1 ORDER BY next_session ASC LIMIT 5', [medicID]));
}

module.exports = { getMedicHomeData, getMedicHomeCalander, getMedicHomeClients};