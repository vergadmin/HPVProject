let HomepageVisitTimeStamp = Date.now();

window.addEventListener("load", () => {
    // var type = document.URL.split('/').reverse()[0]
    var id = document.URL.split('/').reverse()[1]
    console.log(id)
    sessionStorage.setItem("id", id)
    // sessionStorage.setItem("type", type)

    // console.log("TIME")
    dateTime = new Date().toLocaleString() + " " + Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(dateTime)
});


function setDeviceDetails(){
    const userAgent = navigator.userAgent;
    const { platform, operatingSystem, browser } = parseUserAgent(userAgent);
    sessionStorage.setItem("platform", platform);
    sessionStorage.setItem("operatingSystem", operatingSystem);
    sessionStorage.setItem("browser", browser);
}

async function ContinueOrResetSession(character){
    console.log(character !== sessionStorage.getItem("type"))
    // var type = document.URL.split('/').reverse()[0]
    var id = document.URL.split('/').reverse()[1]
    if(character !== sessionStorage.getItem("type")){    

        sessionStorage.clear()
        sessionStorage.setItem("id", id)
        sessionStorage.setItem("type", character)
        setDeviceDetails();
        sessionStorage.setItem('InterventionStartTime', new Date(HomepageVisitTimeStamp).toISOString().slice(0, 19).replace('T', ' '))
        response = await CreateEntryInDB();
    }
    window.location.href=`/${id}/EducationalComponent/${character}/Introduction`
}

async function CreateEntryInDB(){
    data = JSON.stringify(sessionStorage)
    response = await fetch('/createEntry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify content type as JSON
        },
        body: JSON.stringify(sessionStorage)
    });
}