var startTime; 
var endTime; 
 addZero = function(number) {
    return (number < 10 ? '0' : '') + number;
  };
 getTimestamp = function() {
    // Create a new Date object
    var date = new Date();

    // Get individual date components
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Month is zero-based
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Format the timestamp as desired (e.g., YYYY-MM-DD HH:MM:SS)
    var timestamp = year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);

    return timestamp;
  };

window.onload = function() {
    
    // Function to add leading zero to single-digit numbers
    

    // Get timestamp as soon as the page loads
    startTime = getTimestamp();
    console.log("Page loaded at: " + startTime);
  };

function calculateDuration(pageName){
    endTime = getTimestamp();

    var start = new Date(startTime);
      var end = new Date(endTime);
      var duration = end - start;

      // Format duration
      var minutes = Math.floor(duration / 60000);
      var seconds = Math.floor((duration % 60000) / 1000);
      var milliseconds = duration % 1000;
        var Duration=minutes + " minutes, " + seconds + " seconds, " + milliseconds + " milliseconds";
      console.log("Duration: " + minutes + " minutes, " + seconds + " seconds, " + milliseconds + " milliseconds");
    sendToDatabase(pageName,Duration)
}

async function sendToDatabase(column, value) {
    

     console.log("IN REGISTER CLICK FROM CLIENT")
     console.log(column + ": " + value)

    let url = '/updateDatabase';
    let data = {};
    data[column] = value
    // console.log(data)

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (res.ok) {
        let ret = await res.json();
        return JSON.parse(ret.data);

    } else {
        return `HTTP error: ${res.status}`;
    }
}

