var myVideo = document.getElementById("myvideo");
var id = document.body.getAttribute("id-variable");
var type = document.body.getAttribute("type-variable");
var nextPage = document.body.getAttribute("next-page-variable");
var playButton = document.getElementById("playButton");
var VideoArrayIndex = 1;

ifInvalidSessionTaketoHomePage();

// if(sessionStorage.getItem("VideoArrIndex") === null){
//   var VideoArrayIndex = 1;
//   sessionStorage.setItem("VideoArrIndex", VideoArrayIndex);
// }
// else{
//   var VideoArrayIndex = sessionStorage.getItem("VideoArrIndex");
// }

//Format is, pageName, Video URL, Whether Page Visited, Whether More information requested (Where applicable)
var VideoArrNames = ["Homepage", "Introduction", "HPVVaccineReceived", "HPVVaccineInformation", "HPVVaccineCancerPrevention", "Recommendation", "NextVisit", "Transcript"]

var PageName = VideoArrNames[VideoArrayIndex];

VideoArray = JSON.parse(sessionStorage.getItem("VideoArr"));


// Get the button element by its ID
var rewindButton = document.getElementById("rewind");
var pauseButton = document.getElementById("pause");
var nextButton = document.querySelector(".next");

if ((PageName != "quickAssessment") && (PageName != "overviewTransplantWaitingList")) {
  nextButton.style.display = "block";
  if (document.getElementsByClassName('slider-container').length > 0) {
    document.getElementsByClassName('slider-container')[0].style.display = "none";
  }
}

// Add a click event listener to the button
pauseButton.addEventListener("click", function () {
  // Toggle between pausing and playing the video
  if (myVideo.paused) {
    myVideo.play();
    pauseButton.textContent = "Pause";
    if (PageName === "Introduction") {
      playButton.style.display = "none";
      playButton.parentElement.style.backgroundColor = "transparent";
    }
  } else {
    myVideo.pause();
    pauseButton.textContent = "Play";
    if (PageName === "Introduction") {
      playButton.style.display = "flex";
      playButton.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    }
  }
});

//Rewinds the Video by 10seconds for the User.
rewindButton.addEventListener("click", function () {
  myVideo.currentTime -= 10;
  if (myVideo.paused) {
    myVideo.play();
    pauseButton.textContent = "Pause";
  }
});

//OnEnded Function for autoplay video sequence
myVideo.onended = function (e) {
  if (PageName === "subTopics") {
    if (moduleName === "Talking to your doctor") {
      if (myVideo.getElementsByTagName("source")[0].getAttribute('src') !==
        `https://national-kidney-foundation.s3.amazonaws.com/${type}/talkingToYourDoctor.mp4`) {
        PreviousNextButtonFunction(1, false);
      }
      else {
        var sliderValueForEndPage = parseInt(sessionStorage.getItem("sliderResponse"))
        if (sliderValueForEndPage >= 70) {
          UpdateVideo(`https://national-kidney-foundation.s3.amazonaws.com/${type}/endOfMeetingResponse1.mp4`)
        }
        else {
          UpdateVideo(`https://national-kidney-foundation.s3.amazonaws.com/${type}/endOfMeetingResponse2.mp4`)
        }
        nextButton.style.display = "block";
      }

    }
    else if (moduleName === "Overview - The waiting list" && myVideo.getElementsByTagName("source")[0].getAttribute('src') ===
      `https://national-kidney-foundation.s3.amazonaws.com/${type}/overviewTransplantWaitingList.mp4`) {
      document.getElementsByClassName('overview-buttons')[0].style.display = "block";
    }
    else {
      SwitchSubTopicVideo(1,false);
    }
  }
  else if (PageName === "quickAssessment") {
    if(moduleName === "main"){
      nextButton.style.display = "block";
    }
    else{
      PreviousNextButtonFunction(1,false);
      document.getElementsByClassName('slider-container')[0].style.display = "none";
    }
  }
  else if (PageName === "Introduction") {
    PreviousNextButtonFunction(1,false);
  }
  pauseButton.textContent = "Play";
  // if(PageName === "Introduction"){
  //   playButton.style.display = "flex";
  //   playButton.parentElement.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
  // }
}

//Updates the play/pause button.
myVideo.onplaying = function (e) {
  pauseButton.textContent = "Pause";
  playButton.style.display = "none";
  playButton.parentElement.style.backgroundColor = "transparent";
}

//Updates the play/pause button.
myVideo.onpause = function (e) {
  pauseButton.textContent = "Play";
}


playButton.addEventListener("click", function () {
  if (myVideo.paused) {
    myVideo.play();
    playButton.style.display = "none";
    playButton.parentElement.style.backgroundColor = "transparent";
  }
});

//VideoUpdater Function / Autoplay Video
function UpdateVideo(videoUrl) {
  myVideo.getElementsByTagName("source")[0].setAttribute('src', videoUrl);
  // myVideo.getElementsByTagName("track")[0].setAttribute('src', videoUrl.substr(0, videoUrl.lastIndexOf('.')) + ".vtt")
  myVideo.load();
  myVideo.play().catch(function() {
    //Ignore the Uncaught (in promise) error.
});;
}

//Master Function for the buttons.
function PreviousNextButtonFunction(action, activeTrigger = null) {
    if (VideoArrayIndex + action < 0) {
      VideoArrayIndex = 0;
    }
    else if (VideoArrayIndex + action > Object.keys(VideoArray).length - 1) {
      VideoArrayIndex = Object.keys(VideoArray).length - 1;
    }
    else {
      VideoArrayIndex = VideoArrayIndex + action;
    }

    PageName = VideoArrNames[VideoArrayIndex]

    if (PageName === "Homepage") {
      logActiveTriggerOrNot(PageName, moduleName = null, activeTrigger = true);
      window.location.href = `/${id}/`
    }
    else if(PageName === "Introduction"){
        UpdateTitle("Alex: Your Virtual Assistant");
    }
    else if (PageName === "HPVVaccineReceived") {
      UpdateTitle("Have you received an HPV vaccine?");
      createButtons(3, ["Yes", "No", "Not Sure"], "HPVVaccineReceived");
      StopAndUnloadVideo();
      ShowVideoDiv(false);

    }
    else if (PageName === "subTopics" && action === 1) {
      //UpdateVideo(VideoArray[PageName]['Benefits of kidney transplant'].VideoURL)
      moduleName = 'Benefits of kidney transplant';
      UpdateDropdown(moduleName, activeTrigger);
    }
    else if (PageName === "subTopics" && action === -1) {
      //UpdateVideo(VideoArray[PageName]['Benefits of kidney transplant'].VideoURL)
      moduleName = 'Benefits of kidney transplant';
      UpdateDropdown(moduleName,activeTrigger)
    }
    else {
      // UpdateVideo(VideoArray[PageName].VideoURL)
    }

  }
  if(PageName === 'subTopics'){
    //do Nothing
  }
  else{
    logActiveTriggerOrNot(PageName, moduleName , activeTrigger)
  }
// }

function UpdateTitle(TitleString) {
  if (document.getElementsByClassName('title').length > 0) {
    document.getElementsByClassName('title')[0].innerHTML = TitleString;
  }
}

function SwitchSubTopicVideo(prevOrNext, activeTrigger = null) {
  const tempArr = ["Benefits of kidney transplant",
    "Who can get a kidney transplant",
    "The transplant work-up",
    "Overview - The waiting list",
    "Living donor transplant",
    "Getting a transplant sooner",
    "How long do kidney transplants last",
    "The risks of kidney transplant",
    "Choosing a transplant center",
    "Who can be a living kidney donor",
    "Talking to your doctor"]
  if (tempArr.indexOf(moduleName) <= tempArr.length - 1) {
    UpdateDropdown(tempArr[tempArr.indexOf(moduleName) + prevOrNext], activeTrigger)
  }
}

async function ResetSession() {
  sessionStorage.setItem("EndTime", Date.now())
  var response = await SendParticipantDataToServer(JSON.parse(sessionStorage.getItem("VideoArr")))

  if(response.status === 200){
    console.log("Now Exit",Date.now());
    sessionStorage.clear();
    window.location.href = `https://wharton.qualtrics.com/jfe/form/SV_ah5rKWqpP5xIn78?ID=${id}`;
  }
  else{
    document.getElementsByClassName("finish")[0].disabled = false;
  }
}

function OverviewResponse(responseString) {
  document.getElementsByClassName('overview-buttons')[0].style.display = "none";
  if (responseString === "Not really") {
    UpdateVideo(`https://national-kidney-foundation.s3.amazonaws.com/${type}/waitingListUsefulnessCheckinResponse1.mp4`)

  }
  else if (responseString === "Somewhat useful") {
    UpdateVideo(`https://national-kidney-foundation.s3.amazonaws.com/${type}/waitingListUsefulnessCheckinResponse2.mp4`)
  }
  else {
    UpdateVideo(`https://national-kidney-foundation.s3.amazonaws.com/${type}/waitingListUsefulnessCheckinResponse3.mp4`)
  }
  sessionStorage.setItem("OverviewUsefulnessCheckInResponse", responseString)
  nextButton.style.display = "block";
}

function TakeToSummaryPage(){
  while(PageName !== 'summary'){
    PreviousNextButtonFunction(1);
  }
  logActiveTriggerOrNot(PageName, moduleName = null, activeTrigger = true)
}

function TakeToHomePage(){
  logActiveTriggerOrNot('Homepage', moduleName = null, activeTrigger = true)
  window.location.href = `/${id}/`
}

function ifInvalidSessionTaketoHomePage(hours = 5){
  var now = new Date().getTime();
  var setupTime = sessionStorage.getItem('setupTime');
  if (setupTime === null || (now-setupTime > hours*60*60*1000)) {
    window.location.href = `/${id}/`;
  } 
}

function HideAllElements(){

}

function createButtons(buttonCount, buttonTexts, topic) {
  const oldContainer = document.querySelector('.overview-buttons');
  
  // Create a new div element with the class 'overview-buttons'
  const newContainer = document.createElement('div');
  newContainer.className = 'overview-buttons';
  newContainer.style.display = 'block';  // Make the new container visible

  // Create buttons and append to the new container
  for (let i = 0; i < buttonCount; i++) {
      const button = document.createElement('button');
      button.textContent = buttonTexts[i];
      button.onclick = () => OverviewResponse(`${topic}`, `${buttonTexts[i]}`);
      newContainer.appendChild(button);
  }

  // Replace the old container with the new container
  oldContainer.replaceWith(newContainer);
}

function StopAndUnloadVideo(){
  myVideo.pause();
  myVideo.getElementsByTagName("source")[0].removeAttribute('src'); // empty source
}

function ShowVideoDiv(boolVal = true){
  if(boolVal === true){
    document.getElementById("video-wrapperID").style.display = "block";
  }
  else{
    document.getElementById("video-wrapperID").style.display = "none";
  }
}