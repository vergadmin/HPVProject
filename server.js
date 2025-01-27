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

app.get('/', (req, res) => {
    id = req.params.id
    res.render('pages/index',{id: id})
})

// You can also add a route for the favicon manually, if needed:
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
  });

// Virtual Human Types
const EducationalComponentRouter = require('./routes/EducationalComponent');
app.use('/EducationalComponent', function(req,res,next) {
    req.id = id;
    //req.type = type
    req.userInfo = userInfo
    next();
}, EducationalComponentRouter)


app.post('/createEntry', async (req, res) => {
    try {
        const requestData = req.body;

        // Validate required fields
        const requiredFields = ['id', 'InterventionStartTime', 'platform', 'operatingSystem', 'browser', 'type'];
        for (const field of requiredFields) {
            if (!requestData[field]) {
                return res.status(400).send(`Missing required field: ${field}`);
            }
        }

        // Connect to the database
        await sql.connect(config);

        // Prepare and execute the insert query
        const result = await sql.query(`
            INSERT INTO [VPF2-PrimaryServer].[dbo].[HPVDataTable]
            ([Participant_ID], [InterventionStartTime], [Platform], [OS_Info], [Browser_Info], [Character_Selected])
            VALUES
            ('${requestData.id}', '${requestData.InterventionStartTime}', '${requestData.platform}', '${requestData.operatingSystem}', '${requestData.browser}', '${requestData.type}')
        `);

        res.send('Function executed successfully');
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    } finally {
        sql.close();
    }
});

app.post('/updateEntry', async (req, res) => {
    try {
        const requestData = req.body;

        // Validate required fields
        const requiredFields = ['id', 'question', 'response'];
        for (const field of requiredFields) {
            if (!requestData[field]) {
                return res.status(400).send(`Missing required field: ${field}`);
            }
        }

        // Connect to the database
        await sql.connect(config);

        // Prepare and execute the update query
        const updateQuery = `
            UPDATE [VPF2-PrimaryServer].[dbo].[HPVDataTable]
            SET [${requestData.question}] = @response
            WHERE [Participant_ID] = @id
        `;

        const request = new sql.Request();
        request.input('response', sql.VarChar, requestData.response);
        request.input('id', sql.VarChar, requestData.id);

        await request.query(updateQuery);

        res.send('Function executed successfully');
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    } finally {
        sql.close();
    }
});


app.listen(process.env.PORT || 3000);