

window.addEventListener("load", async () => {
    if(sessionStorage.length < 1){
        window.location.href = `/${id}/`;
    }
    setPageName();
    await LoadJSONFile();
    LoadPageData();
});

function setPageName(pageToBeSet){
    if(sessionStorage.PageName === undefined){
        sessionStorage.PageName = "Introduction"
    }
    else if(pageToBeSet){
        sessionStorage.PageName = pageToBeSet
    }
    PageName = sessionStorage.PageName;
}

async function LoadJSONFile(){
    try {
        const response = await fetch("/static/pageData.json");
        const data = await response.json();
        PageData = data;
        console.log(PageData);
    } catch (error) {
        console.error("Error fetching the page data:", error);
    }
}

function LoadPageData(){
    PageInfo = PageData[PageName];
    UpdateTitle(PageInfo);
    UpdateVideo(PageInfo.videoURL);
    ShowQuestions(PageInfo.questionOptions)
    ShowNextButton(PageInfo.hideNextButton);
    ShowBackButton(PageInfo.previousPageName);
    ShowSubmitButton(PageName)
}

function UpdateTitle(page){
    tempVar = document.getElementById("title");
    tempVar.innerText = page.title;
}

function ShowNextButton(hideNextBuutton){
    nextButton = document.getElementById("next-button");
    if(hideNextBuutton){
        nextButton.style.display = "none";
    }
    else{
        nextButton.style.display = "block";
    }

}

function ShowBackButton(PageName){
    backButton = document.getElementById("back-button");
    if(PageName){
        backButton.style.display = "block";
    }
    else{
        backButton.style.display = "none";
    }

}

function ShowSubmitButton(PageName){
    submitButton = document.getElementById("submit-button");
    transcriptContainer = document.getElementById("transcript-container");
    if(PageName == "Transcript"){
        submitButton.style.display = "block";
        transcriptContainer.style.display = "block";
        transcriptContainer.innerHTML = "";

        questions_data = sessionStorage.getItem("response_data")
        questions_data = JSON.parse(questions_data)

        for (const [key, value] of Object.entries(questions_data)) {
            const question = document.createElement('label');
            question.textContent = `${key} \t`;

            const response = document.createElement('label');
            response.textContent = value;
            response.style.color = 'navy';

            const checkboxdiv = document.createElement('div');
            checkboxdiv.classList.add('checkboxdiv');
            checkboxdiv.appendChild(question);
            checkboxdiv.appendChild(response);
            transcriptContainer.appendChild(checkboxdiv);
        }
    }
    else{
        submitButton.style.display = "none";
        transcriptContainer.style.display = "none";
    }

}

function ShowQuestions(questions){
    questionsContainer = document.getElementById("questions-container");
    if(questions === null){
        questionsContainer.innerHTML = "";
        questionsContainer.style.display = "none";
    }
    else{
        questionsContainer.innerHTML = "";
        labels = Object.keys(questions);
        labels.forEach(label => {
            const button = document.createElement('button');
            button.className = 'user-selection-button';
            button.textContent = label;
            button.onclick = async () => {
                await logQuestionResponseToDB(PageData[PageName].title, label);
                nextPage(questions[label]);
            };
            questionsContainer.appendChild(button);
        });

        questionsContainer.style.display = "flex";
    }
}

function previousPage(){
    setPageName(PageData[PageName].previousPageName);
    LoadPageData();
}

function nextPage(page){
    if(page){
        setPageName(page);
    }
    else{
        setPageName(PageData[PageName].nextPageName);
    }

    LoadPageData();
}

async function logQuestionResponseToDB(question, response){
    if(sessionStorage.getItem("response_data")){
        questions_data = sessionStorage.getItem("response_data")
        questions_data = JSON.parse(questions_data)
    }
    else{
        questions_data = {}
    }

    questions_data[question] = response
    questions_data = JSON.stringify(questions_data) 
    sessionStorage.setItem("response_data", questions_data)
    console.log(question, response);
    UpdateEntryInDB(question,response);
    return 1;
}

async function UpdateEntryInDB(question,response){
    user_id = sessionStorage.getItem("id");
    console.log(user_id)
    response = await fetch('/updateEntry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify content type as JSON
        },
        body: JSON.stringify(
            {question: question,
                response,response,
                id: user_id
            })
    });
}

function endStudy(){
    submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    setPageName("FinalPage");
    LoadPageData();
    sessionStorage.clear();
}
