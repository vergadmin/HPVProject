var myVideo = document.getElementById("myvideo");
var id=document.body.getAttribute("id-variable");
var type=document.body.getAttribute("type-variable");
var nextPage=document.body.getAttribute("next-page-variable");
var currentPage=document.body.getAttribute("url");

  // Get the button element by its ID
  var rewindButton = document.getElementById("rewind");
  var pauseButton = document.getElementById("pause");
    console.log("in videocomnt");
  var nextButton = document.querySelector(".next");
  var transcriptButton = document.getElementById("viewTranscriptButton");
  if((currentPage!="quickAssessment")&&(currentPage!="overviewTransplantWaitingList")&&(nextButton!=null)){
    nextButton.style.display= "block";
  }

  
  // Add a click event listener to the button
  pauseButton.addEventListener("click", function() {
    console.log("clicked");
    // Toggle between pausing and playing the video
    if (myVideo.paused) {
      myVideo.play();
      pauseButton.textContent = "| |";
    } else {
      myVideo.pause();
      pauseButton.textContent = "▶";
    }
  });

  rewindButton.addEventListener("click", function() {
    myVideo.currentTime -= 10;
});

myVideo.onended=function(e){

  console.log("on end");
  if(currentPage==="quickE"){
    nextButton.style.display="block";
  }
  
  else if(transcriptButton){
    transcriptButton.style.display="block";
  }
  
  else{
    window.location.href="/"+id+"/EducationalComponent/"+type+"/"+nextPage;
  }
}