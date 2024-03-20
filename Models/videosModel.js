// videosModel.js
const { ConnectionPool } = require('mssql');
const dbConfig = require('../database');

// Function to add a new video to the database
async function addVideo(name, description) {
  try {
    const pool = await new ConnectionPool(dbConfig).connect();
    const request = pool.request();
    
    // Insert video into the database
    const query = `
      INSERT INTO Videos (name, description)
      VALUES (@name, @description)
    `;
    request.input('name', name);
    request.input('description', description);
    await request.query(query);

    // Close the connection pool
    pool.close();
    return { success: true };
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
}

module.exports = { addVideo };
