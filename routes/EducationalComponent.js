const express = require('express')
const router = express.Router()
var sql = require("mssql");

var id = ''
var vh = ''
var type = ''

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

router.get('/:type/Introduction', getInfo, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    res.render("pages/type/EducationalComponent/introduction", {id: id, type: type, nextPageURL: 'receivedVaccineQuestion', url: 'Introduction'})
})



function getInfo(req, res, next) {
    // console.log("IN MIDDLEWARE OF EDUCATIONAL COMPONENT - REQUEST PARAMS:")
    id = req.id
    userInfo = req.userInfo
    // console.log("type is " + type);
    next()
}

module.exports = router