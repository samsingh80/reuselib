const express = require('express');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require('@sap/xssec');
const xssec = require('@sap/xssec');
const passport = require('passport');
// const FormData = require('form-data');
// const bodyParser = require('body-parser');
// const axios = require('axios').default;
// const formidable = require('express-formidable');

// const fs = require("fs-extra");
// var multer = require('multer');
// var upload = multer();
const app = express();

var xsuaaservice = xsenv.serviceCredentials({ name: 'SER_DB_CAP-uaa' }); //Change name
passport.use(new JWTStrategy(xsuaaservice));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.use('/commonlib', express.static('static'));


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Listening on port ' + port);
});