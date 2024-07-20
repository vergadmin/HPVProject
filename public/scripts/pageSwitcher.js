

window.addEventListener("load", async () => {
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
            button.onclick = () => nextPage(questions[label]);
            questionsContainer.appendChild(button);
        });

        questionsContainer.style.display = "flex";
    }
}

function backtoHomepage(){
    setPageName("Introduction");
    window.location.href=`/${id}/`;
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