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


//Rewinds the Video by 10seconds for the User.
rewindButton.addEventListener("click", function () {
  myVideo.currentTime -= 10;
  if (myVideo.paused) {
    myVideo.play();
    pauseButton.textContent = "Pause";
  }
});

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

myVideo.onended=function(e){
  nextPage();
}


//VideoUpdater Function / Autoplay Video
function UpdateVideo(videoUrl) {
  type = sessionStorage.getItem("type");
  videoContainer = document.getElementById("video-container");
  if(videoUrl === null){
    videoContainer.style.display = "none";
    myVideo.getElementsByTagName("source")[0].setAttribute('src', "");
    myVideo.load();
  }
  else{
    videoContainer.style.display = "block";
    videoUrl = `https://hpv-project.s3.amazonaws.com/${type}/` + videoUrl;
    myVideo.getElementsByTagName("source")[0].setAttribute('src', videoUrl);
    myVideo.load();
    myVideo.play().catch(function() {
      //Ignore the Uncaught (in promise) error.
    });
  }
}