require('dotenv').config();
const express = require('express');
var logger = require('morgan');
const router = require('./routes');
const domainRouter = require('./routes/domain');
const {checkSecretToken} = require("./libs/middleware");

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/', router);
app.use('/api/domain', checkSecretToken, domainRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;