const express = require('express');
const {runDomainCheck, addDomainToList} = require('../libs/monitoring');

const router = express.Router();

// Endpoint to add domain to the list
router.post('/add', async (req, res) => {
    const domain = req.body.domain;
    if (!domain) {
        return res.status(400)
            .json({
                status: "Failed",
                message: "Domain is required"
            });
    }

    const process = await addDomainToList(domain);
    if (!process.status) {
        return res.status(400)
            .json({
                status: "Failed",
                message: process.message
            });
    }

    return res.status(200)
        .json({
            status: "Ok",
            message: process.message
        });
});

// Endpoint to trigger domain check with a security token
router.get('/check', async (req, res) => {

    await runDomainCheck();
    return res.status(200)
        .json({
            status: "Ok",
            message: "Domain check completed"
        });
});

module.exports = router;