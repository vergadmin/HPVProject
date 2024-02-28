window.addEventListener("load", () => {
    let browserInfo = ""
    let dateTime = ""
    // var type = document.URL.split('/').reverse()[0]
    var id = document.URL.split('/').reverse()[0]
    console.log(id)
    sessionStorage.setItem("id", id)
    // sessionStorage.setItem("type", type)

    // (B1) PARSE USER AGENT
    browserInfo = detectBrowser();
    osInfo = getOS()
    let platformInfo = checkDeviceType();

    // console.log("TIME")
    dateTime = new Date().toLocaleString() + " " + Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(dateTime)
    sendGeneralData(browserInfo, osInfo, platformInfo, dateTime)

    
});

async function sendGeneralData(browserInfo, osInfo, platformInfo, dateTime) {
    console.log("IN SEND TO SERVER GENERAL DATA")
    let url = '/updateDatabase';
    let data = {
        'Date_time': dateTime,
        'Browser_Info': browserInfo,
        'OS_Info': osInfo,
        'Platform': platformInfo
    };

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (res.ok) {
        let ret = await res.json();
        console.log("done sending to server")
        return JSON.parse(ret.data);
    } else {
        return `HTTP error: ${res.status}`;
    }
}

// helper function to detect browser
function detectBrowser() {
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "OPR" or after "Version"
    if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+4);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In MS Edge, the true version is after "Edg" in userAgent
    else if ((verOffset=nAgt.indexOf("Edg"))!=-1) {
        browserName = "Microsoft Edge";
        fullVersion = nAgt.substring(verOffset+4);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
            (verOffset=nAgt.lastIndexOf('/')) ) 
    {
        browserName = nAgt.substring(nameOffset,verOffset);
        fullVersion = nAgt.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
        fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
        fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
    fullVersion  = ''+parseFloat(navigator.appVersion); 
    majorVersion = parseInt(navigator.appVersion,10);
    }

    return browserName + " " + majorVersion
}

// helper function to detect platform/os
function getOS() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
}

// helper function to detect if device is a mobile, tablet, or desktop based on screen width
function checkDeviceType() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
        return "Mobile";
    } else if (screenWidth < 1024) {
        return "Tablet";
    } else {
        return "Desktop";
    }
}
