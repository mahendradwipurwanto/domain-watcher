const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Domain monitoring service is running.');
});

module.exports = router;