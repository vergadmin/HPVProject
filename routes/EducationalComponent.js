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

 /* let buttons = [
    {
        url: 'Introduction',
        text: "Introduction"
    },
    {
        url: '1',
        text: "What are research studies?"
    },
    {
        url: '2',
        text: "Why consider participating?"
    },
    {
        url: '3',
        text: "Are research studies safe?"
    },
    {
        url: '4',
        text: "How to participate in research and where to start?"
    }
] 
*/

router.get('/:type/Introduction', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/introduction", {id: id, type: type, nextPageURL: 'receivedVaccineQuestion', url: 'Introduction'})
})

router.get('/:type/receivedVaccineQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'receivedVaccineQuestion', info: receivedVaccineQuestionInfo})
})

router.get('/:type/howManyVaccinesQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'howManyVaccinesQuestion', info: howManyVaccinesQuestionInfo})
})

router.get('/:type/whenVaccineReceivedQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'whenVaccineReceivedQuestion', info: whenVaccineReceivedQuestionInfo})
})


router.get('/:type/completedVaccineSeriesQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'completedVaccineSeriesQuestion', info: completedVaccineSeriesQuestionInfo})
})


router.get('/:type/hpvCancerPreventionQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'hpvCancerPreventionQuestion', info: hpvCancerPreventionQuestionInfo})
})

router.get('/:type/doYouPlanToGetVaccineQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'doYouPlanToGetVaccineQuestion', info: doYouPlanToGetVaccineQuestionInfo})
})


router.get('/:type/reasonsForNotConsideringQuestion', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/buttonResponseTemplatePage", {id: id, type: type, url: 'reasonsForNotConsideringQuestion', info: reasonsForNotConsideringQuestionInfo})
})



router.get('/:type/recommendation', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/recommendation", {id: id, type: type, nextPageURL: 'doYouPlanToGetVaccineQuestion', url: 'recommendation'})
})

router.get('/:type/hpvInformation', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/hpvInformation", {id: id, type: type, nextPageURL: 'hpvCancerPreventionQuestion', url: 'hpvInformation'})
})

router.get('/:type/discussWithDoctor', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/discussWithDoctor", {id: id, type: type, nextPageURL: 'finalTranscriptPage', url: 'discussWithDoctor'})
})

router.get('/:type/suggestionsForOncologyVisit', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/suggestionsForOncologyVisit", {id: id, type: type, nextPageURL: 'finalTranscriptPage', url: 'suggestionsForOncologyVisit'})
})

router.get('/:type/finalTranscriptPage', getInfo, updateDatabase, (req, res) => { // displays  the text "Introduction" in the URL
    type=req.params.type
    console.log('Hiel: ',type)
    res.render("pages/type/EducationalComponent/finalTranscriptPage", {id: id, type: type, url: 'finalTranscriptPage'})
})

var receivedVaccineQuestionInfo = {
    title: "Have you received an HPV vaccine?",
    buttons: [
        {
            buttonName: "Yes",
            linkToURL: "howManyVaccinesQuestion"
        },
        {
            buttonName: "No",
            linkToURL: "hpvInformation"
        },
        {
            buttonName: "Not Sure",
            linkToURL: "hpvInformation"
        }
    ]
}

var howManyVaccinesQuestionInfo = {
    title: "How many HPV vaccines have you received?",
    buttons: [
        {
            buttonName: "1",
            linkToURL: "whenVaccineReceivedQuestion"
        },
        {
            buttonName: "2",
            linkToURL: "whenVaccineReceivedQuestion"
        },
        {
            buttonName: "3",
            linkToURL: "whenVaccineReceivedQuestion"
        },
        {
            buttonName: "Not sure",
            linkToURL: "whenVaccineReceivedQuestion"
        }
    ]
}

var whenVaccineReceivedQuestionInfo = {
    title: "When did you receive HPV vaccines(s)?",
    buttons: [
        {
            buttonName: "Before I was treated for cancer",
            linkToURL: "completedVaccineSeriesQuestion"
        },
        {
            buttonName: "After I was treated for Cancer",
            linkToURL: "completedVaccineSeriesQuestion"
        },
        {
            buttonName: "Before and After I was treated for cancer",
            linkToURL: "completedVaccineSeriesQuestion"
        },
        {
            buttonName: "Not sure",
            linkToURL: "hpvInformation"
        }
    ]
}

var completedVaccineSeriesQuestionInfo = {
    title: "Have you received the complete HPV vaccine series (3 vaccines) AFTER completing cancer treatment?",
    buttons: [
        {
            buttonName: "Yes",
            linkToURL: "hpvInformation"
        },
        {
            buttonName: "No",
            linkToURL: "hpvInformation"
        }
    ]
}

var hpvCancerPreventionQuestionInfo = {
    title: "Did you know that the HPV vaccine is a cancer prevention vaccine?",
    buttons: [
        {
            buttonName: "Yes",
            linkToURL: "recommendation"
        },
        {
            buttonName: "No",
            linkToURL: "recommendation"
        }
    ]
}

var doYouPlanToGetVaccineQuestionInfo = {
    title: "Do you plan to get the HPV vaccine series?",
    buttons: [
        {
            buttonName: "Yes",
            linkToURL: "discussWithDoctor"
        },
        {
            buttonName: "No",
            linkToURL: "reasonsForNotConsideringQuestion"
        },
        {
            buttonName: "Not Sure",
            linkToURL: "reasonsForNotConsideringQuestion"
        }
    ]
}

var reasonsForNotConsideringQuestionInfo = {
    title: "What are your reasons for not considering it?",
    buttons: [
        {
            buttonName: "I don't think I need the HPV vaccine",
            linkToURL: "suggestionsForOncologyVisit"
        },
        {
            buttonName: "I prefer not receiving vaccines in general",
            linkToURL: "suggestionsForOncologyVisit"
        },
        {
            buttonName: "I am concerned about side effects",
            linkToURL: "suggestionsForOncologyVisit"
        },
        {
            buttonName: "Other reasons",
            linkToURL: "suggestionsForOncologyVisit"
        }
    ]
}



function getInfo(req, res, next) {
    // console.log("IN MIDDLEWARE OF EDUCATIONAL COMPONENT - REQUEST PARAMS:")
    id = req.id
    userInfo = req.userInfo
    // console.log("type is " + type);
    next()
}

function updateDatabase(req, res, next) {
    // console.log("IN UPDATE DATABASE")
    // console.log(req.url)
    let dbEntry = req.url.slice(1)
    // console.log(dbEntry)
    userInfo = req.userInfo;
    // BEGIN DATABSAE STUFF:SENDING VERSION (R24 OR U01) AND ID TO DATABASE
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // let queryString = 'UPDATE R24 SET Educational_' + dbEntry + `='clicked' WHERE ID=` + `'` + userInfo.ID + `'`; // UNCOMMENT:`'AND TYPE ='` + type + `'`;
        let queryString = `
        UPDATE R24
        SET Educational_` + dbEntry + `= 'clicked'
        WHERE ID = '` + userInfo.ID + `' 
        AND VisitNum = '` + userInfo.visitNum + `'`;

        // console.log(queryString)
        request.query(queryString, function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            /// console.log("UPDATED! IN R24U01 TABLE:")
            // console.log(recordset);
        }); 
        // res.send("Updated.");
    
    });
    // END DATABASE STUFF

    next();
}

module.exports = router