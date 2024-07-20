window.addEventListener("load", () => {
    let browserInfo = ""
    let dateTime = ""
    // var type = document.URL.split('/').reverse()[0]
    var id = document.URL.split('/').reverse()[1]
    console.log(id)
    sessionStorage.setItem("id", id)
    // sessionStorage.setItem("type", type)

    // console.log("TIME")
    dateTime = new Date().toLocaleString() + " " + Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(dateTime)
});


async function ContinueOrResetSession(character){
    console.log(character !== sessionStorage.getItem("type"))
    // var type = document.URL.split('/').reverse()[0]
    var id = document.URL.split('/').reverse()[1]
    if(character !== sessionStorage.getItem("type")){    

        sessionStorage.clear()
        sessionStorage.setItem("id", id)
        sessionStorage.setItem("type", character)

    }
    window.location.href=`/${id}/EducationalComponent/${character}/Introduction`
}
