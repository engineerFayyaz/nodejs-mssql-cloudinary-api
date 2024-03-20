// userModel.js
const { ConnectionPool } = require('mssql');
const dbConfig = require('../database');

// Function to add a new user to the database
async function addUser(email, password) {
  try {
    const pool = await new ConnectionPool(dbConfig).connect();
    const request = pool.request();
    
    // Insert user into the database
    const query = `
      INSERT INTO Users (email, password)
      VALUES (@email, @password)
    `;
    request.input('email', email);
    request.input('password', password);
    await request.query(query);

    // Close the connection pool
    pool.close();
    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

module.exports = { addUser };
