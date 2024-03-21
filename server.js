// server.js
const express = require('express');
const { createTables } = require('./database');
const { registerUser, loginUser, getAllUsers } = require('./controllers/authController');
const videoRoutes = require('./routes/videoRoutes');
const imageRoutes = require('./routes/imageRoutes');
const checkRoute = require('./routes/checkRoute'); // Import the checkRoute module

const app = express();
const port = 3000;

// Create tables if not exists
createTables().then(() => {
    // Middleware
    app.use(express.json());

    // Auth routes
    app.post('/api/register', registerUser);
    app.post('/api/login', loginUser);

    // Video routes
    app.use('/api/videos', videoRoutes);

    // Image routes
    app.use('/api/images', imageRoutes);

    app.use('/api/check', checkRoute);

    app.use('/api/users', getAllUsers);

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Error creating tables:', error);
    process.exit(1); // Exit the process with error code 1
});
