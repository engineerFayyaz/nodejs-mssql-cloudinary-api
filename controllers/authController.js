// authController.js
const { ConnectionPool } = require('mssql');
const { createTables } = require('../database'); // Import createTables function

// Call createTables to ensure the database connection is initialized
createTables()
    .then(() => console.log('Database tables created')) // Log success
    .catch(error => console.error('Error creating database tables:', error)); // Log error

// Import dbConfig from database.js
const dbConfig = require('../database').dbConfig;

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.query; // Extract parameters from query string
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Create a new connection pool
        const pool = new ConnectionPool(dbConfig);
        await pool.connect();
        
        // Check if user already exists
        const result = await pool.query`SELECT * FROM Users WHERE email = ${email}`;
        if (result.recordset.length > 0) {
            pool.close();
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Insert new user into the database
        await pool.query`INSERT INTO Users (email, password) VALUES (${email}, ${password})`;
        pool.close();
        
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.query; // Extract parameters from query string
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Create a new connection pool
        const pool = new ConnectionPool(dbConfig);
        await pool.connect();
        
        // Retrieve user from the database
        const result = await pool.query`SELECT * FROM Users WHERE email = ${email} AND password = ${password}`;
        pool.close();
        
        // Check if any user was found
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // User found, login successful
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Create a new connection pool
        const pool = new ConnectionPool(dbConfig);
        await pool.connect();

        // Retrieve all users from the database
        const result = await pool.query`SELECT * FROM Users`;

        // Close the connection pool
        pool.close();

        // Return the list of users
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
