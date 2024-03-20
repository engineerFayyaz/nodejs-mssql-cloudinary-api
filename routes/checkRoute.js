// routes/checkRoute.js
const express = require('express');
const router = express.Router();

// GET route to check if the server is running
router.get('/', (req, res) => {
    res.send('Server is up and running!');
});

module.exports = router;
