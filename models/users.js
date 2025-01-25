const pool = require('../db');
const bcrypt = require('bcrypt');

const findUserByPhone = async (phone) => {
    return (await pool.query('SELECT * FROM clients WHERE phone_number = $1 LIMIT 1',[phone]))
}

const createUser = async (user) => {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(user.password, 10);
      // Create the user
      const newUser = await pool.query(
        'INSERT INTO clients (full_name, age, gender, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.fullName, user.age, user.gender, user.phone, hashedPassword]
      );
      return newUser.rows[0];
    } catch (error) {
      console.error(error);
      // res.status(500).json({ message: 'An error occurred while creating the user' });
    }
  };

  const findUserByUserName = async (userName) => {
    let table = '';
    result = await pool.query('SELECT * FROM clients WHERE full_name = $1 LIMIT 1',[userName]);
    if (result.rowCount != 0) {
      table = 'client';
      return [result, table];
    } 

    result = await pool.query('SELECT * FROM medics WHERE first_name = $1 LIMIT 1',[userName]);
    if (result.rowCount != 0) {

      table = 'dentist';
      return [result, table];
    }

    result = await pool.query('SELECT * FROM admins WHERE username = $1 LIMIT 1',[userName]);
    table = 'admin';
    return [result, table];
  }
 module.exports = { findUserByPhone, createUser, findUserByUserName};