// database.js
const mssql = require('mssql');

const dbConfig =  {
  server: 'CODESINC\\MSSQLSERVER01',
  database: 'testing',
  port: 1433, // Default SQL Server port
  authentication: {
    type: 'default',
    options: {
      userName: 'testing',
      password: '12345678',
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  driver: 'tedious'
};

let pool;

async function createPool() {
  try {
    if (!pool) {
      pool = await mssql.connect(dbConfig);
      console.log('Connected to the database');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

async function createTables() {
  try {
    await createPool(); // Ensure the pool is created before proceeding

    // Create Videos table if not exists
    await createVideosTable();

    // Create Auth table if not exists
    await createAuthTable();

    // Create Images table if not exists
    await createImagesTable();
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error; // Rethrow the error to handle it outside
  }
}

async function createVideosTable() {
  try {
    const request = pool.request();
    const tableCheckQuery = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Videos'`;
    const tableCheckResult = await request.query(tableCheckQuery);
    if (tableCheckResult.recordset.length === 0) {
      const createTableQuery = `
        CREATE TABLE Videos (
          id INT IDENTITY(1,1) PRIMARY KEY,
          url NVARCHAR(255)
        )
      `;
      await request.query(createTableQuery);
      console.log('Videos table created successfully');
    } else {
      console.log('Videos table already exists');
    }
  } catch (error) {
    console.error('Error creating Videos table:', error);
    throw error;
  }
}

async function createAuthTable() {
  try {
    const request = pool.request();
    const tableCheckQuery = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Auth'`;
    const tableCheckResult = await request.query(tableCheckQuery);
    if (tableCheckResult.recordset.length === 0) {
      const createTableQuery = `
      CREATE TABLE Auth (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255),
        password NVARCHAR(255),
        phoneNumber NVARCHAR(20),
        country NVARCHAR(100),
        city NVARCHAR(100)
      )
    `;
      await request.query(createTableQuery);
      console.log('Auth table created successfully');
    } else {
      console.log('Auth table already exists');
    }
  } catch (error) {
    console.error('Error creating Auth table:', error);
    throw error;
  }
}

async function createImagesTable() {
  try {
    const request = pool.request();
    const tableCheckQuery = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Images'`;
    const tableCheckResult = await request.query(tableCheckQuery);
    if (tableCheckResult.recordset.length === 0) {
      const createTableQuery = `
        CREATE TABLE Images (
          id INT IDENTITY(1,1) PRIMARY KEY,
          url NVARCHAR(255),
          description NVARCHAR(255)
        )
      `;
      await request.query(createTableQuery);
      console.log('Images table created successfully');
    } else {
      console.log('Images table already exists');
    }
  } catch (error) {
    console.error('Error creating Images table:', error);
    throw error;
  }
}

module.exports = { createTables, dbConfig };
