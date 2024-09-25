var myVideo = document.getElementById("myvideo");
var id=document.body.getAttribute("id-variable");
var type=document.body.getAttribute("type-variable");
var nextPage=document.body.getAttribute("next-page-variable");
var currentPage=document.body.getAttribute("url");

// Get the button element by its ID
var rewindButton = document.getElementById("rewind");
var pauseButton = document.getElementById("pause");
var nextButton = document.querySelector(".next");
var playButton = document.getElementById("playButton");

window.addEventListener("load", async () => {
  await LoadJSONFile();
  language = sessionStorage.getItem("language");
});

// Add a click event listener to the button
pauseButton.addEventListener("click", function () {
  // Toggle between pausing and playing the video
  if (myVideo.paused) {
    myVideo.play();
    pauseButton.textContent = PageData["pause-button"]["languageTitle"][language];
    if (PageName === "Introduction") {
      playButton.style.display = "none";
      playButton.parentElement.style.backgroundColor = "transparent";
    }
  } else {
    myVideo.pause();
    pauseButton.textContent = PageData["play-button"]["languageTitle"][language];
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
    pauseButton.textContent = PageData["pause-button"]["languageTitle"][language];
  }
});


//Rewinds the Video by 10seconds for the User.
rewindButton.addEventListener("click", function () {
  myVideo.currentTime -= 10;
  if (myVideo.paused) {
    myVideo.play();
    pauseButton.textContent = PageData["pause-button"]["languageTitle"][language];
  }
});

//Updates the play/pause button.
myVideo.onplaying = function (e) {
  pauseButton.textContent = PageData["pause-button"]["languageTitle"][language];
  playButton.style.display = "none";
  playButton.parentElement.style.backgroundColor = "transparent";
}

//Updates the play/pause button.
myVideo.onpause = function (e) {
  pauseButton.textContent = PageData["play-button"]["languageTitle"][language];
}

playButton.addEventListener("click", function () {
  if (myVideo.paused) {
    myVideo.play();
    playButton.style.display = "none";
    playButton.parentElement.style.backgroundColor = "transparent";
  }
});

myVideo.onended=function(e){
  nextPage();
}


//VideoUpdater Function / Autoplay Video
function UpdateVideo(videoUrl) {
  type = sessionStorage.getItem("type");
  language = sessionStorage.getItem("language");
  videoContainer = document.getElementById("video-container");
  if(videoUrl === null){
    videoContainer.style.display = "none";
    myVideo.getElementsByTagName("source")[0].setAttribute('src', "");
    myVideo.load();
  }
  else{
    videoContainer.style.display = "block";
    videoUrl = `https://hpv-project.s3.amazonaws.com/${language}/${type}/` + videoUrl;
    myVideo.getElementsByTagName("source")[0].setAttribute('src', videoUrl);
    myVideo.load();
    myVideo.play().catch(function() {
      //Ignore the Uncaught (in promise) error.
    });
  }
}