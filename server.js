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

// this function is called from the client to register info from the front end to the db
app.post('/updateDatabase', async (req, res) => {
    let setList = ''
    console.log("IN UPDATE DATABASE")
    console.log(userInfo)
    console.log(req.body);
    for (const [key, value] of Object.entries(req.body)) {
        setList += key + `='` + value + `', `
    }
    setList = setList.slice(0, -2); 
    console.log(setList);

    // BEGIN DATABSAE STUFF:SENDING VERSION (R24 OR U01) AND ID TO DATABASE
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        let queryString = `UPDATE HPVDataTable SET ` + setList + ` WHERE Participant_ID = '` + userInfo.ID +  `'`;
        request.query(queryString, function (err, recordset) {
            if (err) console.log(err) 
            console.log("updated db! with js index info")
        }); 
    });
    // END DATABASE STUFF
})

app.get('/:id', registerVisit, (req, res) => {
    id = req.params.id
    res.render('pages/index',{id: id})
})

function registerVisit(req, res, next) {
    sql.connect(config, function (err) {
        var request = new sql.Request();
        console.log("IN REGISTER VISIT")
        userInfo['ID'] = req.params.id
        // Query Check for Existing Entry In Table
        let checkString = `SELECT visitNum FROM HPVDataTable WHERE Participant_ID = '` + userInfo['ID'] + `';`;
        console.log(checkString)
        request.query(checkString, function(err, recordset) {
            if (err) console.log(err);
            // if user id exists in db, increment their visitNum
            if (recordset.recordset.length !== 0) {
                console.log("returning user");
                sql.connect(config, function (err) {
                    var request = new sql.Request();
                    let queryString = `UPDATE HPVDataTable SET visitNum = visitNum+1 WHERE Participant_ID = '` + userInfo['ID'] + `';`;
                    request.query(queryString, function (err, recordset) {
                        if (err) console.log(err)
                        console.log(recordset)
                        next();
                    })
                })
            }
            // if user id is not in db, create new record
            else {
                console.log("first visit, adding to db")
                sql.connect(config, function (err) {
                    var request = new sql.Request();
                    let queryString = `INSERT INTO HPVDataTable (Participant_ID) VALUES ('` + userInfo['ID'] + `')`;
                    request.query(queryString, function (err, recordset) {
                        if (err) console.log(err)
                        next();
                    })
                })
            }
        })
    })

}

// Virtual Human Types
const EducationalComponentRouter = require('./routes/EducationalComponent');
app.use('/:id/EducationalComponent', function(req,res,next) {
    req.id = id;
    //req.type = type
    req.userInfo = userInfo
    next();
}, EducationalComponentRouter)

app.listen(process.env.PORT || 3000);