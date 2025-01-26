// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');
const medicsModel = require('../models/medic');
// const sendEmail = require('./sendEmailVerification');
require('dotenv').config();
// const extractImageInfo = require ('./extractImageInfo');

const createUser = async (req, res) => {
  try {
    const requiredFields = ['fullName', 'age', 'gender', 'phone', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }
    const {fullName, age, gender, phone, password} = req.body;
    //checking if user already exists
    const existingUser = await usersModel.findUserByPhone(phone);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Password strength check
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
    }

    //generating a token
    // const verificationToken = crypto.randomBytes(32).toString('hex');
    // const verificationTokenExpiry = (Date.now() + 60000); // Expires in 1 minute

    // Creating the user
    const newUser = await usersModel.createUser({fullName, age, gender, phone, password});

    // // Send verification email
    // const link = `http://localhost:3001/users/verify-email?token=${verificationToken}`;//remember to modify this ------------------------
    // await sendEmail(email, 'Verify Your Email', `Click here to verify your email: ${link}`);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// login
const loginUser = async (req, res) => {
  
  const { userName, password } = req.body;
  
  try {
    //check if the user has provided email and password
    if (!userName || !password) {
      return res.status(400).json({message: 'missing credentials'});
    } 
  
    // Find the user by email 
    const user = await usersModel.findUserByUserName(userName); 

    if (user[0].rowCount == 0) {
      return res.status(401).json({ message: 'Invalid user_name' });
    }

    let pp = await bcrypt.hash(password, 10);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, pp);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user[0].rows[0].id }, secret, { algorithm: 'HS256', expiresIn: '1h' });//modify this

    /// Create a cookie object with token, user id, and tables
    const cookieData = {
      token: token,
      id: user[0].rows[0].id,
      table: user[1],
    };

    //initialize data object for feedbacks and calendar and specials stock data
    const data = {
      feedbacks: [],
      calendar: [],
      stock: [],
      specials: [],
    };

    //sending data of the tables if it is dentist
    if (user[1] == 'dentist') {
      const dentistCalendar = await medicsModel.getMedicCalendar(user[0].rows[0].id);
      data.calendar = dentistCalendar.length > 0 ? dentistCalendar : [] ;
      console.log(data.calendar);
      const dentistSuiviPatients = await medicsModel.getMedicHomeClients(user[0].rows[0].id);
      data.specials = dentistSuiviPatients;

      for (let i = 0; i < data.calendar.length; i++) {
        const clientInfo = await usersModel.findUserById(data.calendar[i].client_id);
        data.calendar[i].full_name = clientInfo.full_name;
        data.calendar[i].phone_number = clientInfo.phone_number;
      }

      // Fetch full_name and phone_number for each client in specials
      for (let i = 0; i < data.specials.length; i++) {
        const clientInfo = await usersModel.findUserById(data.specials[i].client_id);
        data.specials[i].full_name = clientInfo.full_name;
        data.specials[i].phone_number = clientInfo.phone_number;
      }
      console.log(data);
    }
    

    //response object
    const responseData = {
      cookieData: cookieData,
      name: user[0].rows[0].name,
      number: user[0].rows[0].phone_number,
      message: 'Login successful',
      data: data,
    };

    // Set the cookie with token, id, and table
    res.cookie('user_data', JSON.stringify(cookieData), {
      httpOnly: true,   // Prevents access to the cookie via JavaScript
      secure: false,    // Set to true if using HTTPS (for local development with HTTP, use false)
      sameSite: 'Strict', // Protect against CSRF attacks
      maxAge: 3600000,   // Cookie expiration (1 hour)
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// //reseting password
// const resetPassword = async (req,res) => {
//   const { resetToken, newPassword } = req.body;
//   console.log(req.body);
//   try {
//     const user = await usersModel.findUserByResetToken(resetToken);
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid token' });
//     }
//     console.log(1);
//     //verifying if the token still usable
//     const now = Date.now() + 60000;
//     if (user.rows[0].resettokenexpiry < now) {
//         res.status(400).json({ message: 'resetToken expired try over later' });
//     }
//     console.log(2);
//     // Password strength check
//     if (!validator.isStrongPassword(newPassword, {
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 1,
//       minNumbers: 1,
//       minSymbols: 1
//     })) {
//       throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
//     }
//     //hashing the password and save it in the data base
    
//     await usersModel.updateUserPassword(user.rows[0].user_id, newPassword); // Invalidate reset token

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error resetting password' });
//   }
// }

// //get user profle
// const getUserProfile = async (req, res) => {
//   try {
//     const {email} = req.query; 
//     const user = await usersModel.findUserByEmail(email);
//     res.json(user.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// //update users profile
// const updateUserProfile = async (req, res) => {
//   try {
//     const { userId, email, newName, newSurname, newUsername, newProfile_picture, newEmail} = req.body;

//     // Input validation and sanitization
//     if (email && !validator.isEmail(newEmail)) {
//       res.stetus(500).json({message: "invalid email format"});
//     }
//     const oldUser = await usersModel.findUserByEmail(req.query.email);
//     // Sanitization
//     const sanitizedName = (newName && validator.escape(newName)) || (oldUser.rows[0].name);
//     const sanitizedSurname = (newSurname && validator.escape(newSurname)) || (oldUser.rows[0].surname);
//     const sanitizedUsername = (newUsername && validator.escape(newUsername)) || (oldUser.rows[0].user_name);
//     const sanitizedEmail = (newEmail && validator.normalizeEmail(newEmail)) || (oldUser.rows[0].email);
//     const profilePicture = oldUser.rows[0].profile_picture;
    
//     //getting the new image the user provided
//     const targetPath = newProfile_picture? (await extractImageInfo(newProfile_picture)) : (profilePicture);
//       // u^dating user data
//       const newUser = await usersModel.updateUserProfile({sanitizedName, sanitizedSurname, sanitizedUsername, targetPath, sanitizedEmail, userId });
//       console.log(newUser);    
    
//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   };
// }

module.exports = { createUser, loginUser};
