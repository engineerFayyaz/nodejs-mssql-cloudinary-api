// imagesModel.js
const mssql = require('mssql');

// Define the schema for the images table
const imageSchema = `
    CREATE TABLE Images (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(255),
        uploadDate DATETIME DEFAULT GETDATE()
    )
`;

// Function to execute the query to create the Images table
async function createImagesTable() {
    try {
        const pool = await mssql.connect(dbConfig); // Assuming dbConfig is defined elsewhere
        const request = pool.request();
        const result = await request.query(imageSchema);
        console.log('Images table created successfully');
    } catch (error) {
        console.error('Error creating Images table:', error);
        throw error;
    }
}

module.exports = { createImagesTable };
