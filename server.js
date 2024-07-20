const express = require('express')
const session = require('express-session');
const stringSimilarity = require('string-similarity');

const app = express()
const CryptoJS = require("crypto-js");

require('dotenv').config()
// console.log(process.env)

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.json())
var sql = require("mssql");

var userInfo = []

const config = {
    user: 'VergAdmin',
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    port: parseInt(process.env.DBPORT, 10), 
    database: process.env.DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 15,
        secure: true, // switch to true
    }
}))

app.get('/:id', (req, res) => {
    id = req.params.id
    res.render('pages/index',{id: id})
})

// Virtual Human Types
const EducationalComponentRouter = require('./routes/EducationalComponent');
app.use('/:id/EducationalComponent', function(req,res,next) {
    req.id = id;
    //req.type = type
    req.userInfo = userInfo
    next();
}, EducationalComponentRouter)

app.listen(process.env.PORT || 3000);