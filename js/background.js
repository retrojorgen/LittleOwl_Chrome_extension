var iconstatus = false, 
yourShare = false,
allShare = false, 
latestValue = 0,
shareInterval = function () {
    setInterval(function() { 
        setYourShareLogFromXMLHttpRequest(function(output) {
            if(latestValue === 0) {
                    latestValue = yourShare[0].id;
            }
            setAllShareLogFromXMLHttpRequest(function(output) {
                chrome.browserAction.setIcon({path: '../img/icon_online.png'});
                updateBadgeStatus();
            });
        });
    }, 5000);
},
doXMLhttpRequest = function (type,url,callback) {
   var req = new XMLHttpRequest();
    req.open(
        type,
        url,
        true);
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            callback(req.responseText);
        } else {
            callback(false);
        }
    }
},
getLatestValue = function() {
    return latestValue;
}, 
setLatestValueFromPopup = function () {
    latestValue = yourShare[0].id;
},
setYourShareLogFromXMLHttpRequest = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/showshareJSON.php", function(output) {
        if(output) {
            yourShare = JSON.parse(output);
            callback(true);
        }    
            
    });
},
setAllShareLogFromXMLHttpRequest = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/showshareJSON.php?status=all", function(output) {
        allShare = JSON.parse(output);
        callback();    
    });
},
updateBadgeStatus = function () {
    chrome.browserAction.setBadgeBackgroundColor({color:[59, 154, 243, 230]});
    var differenceBetweenLatestSeenShareAndNewestShare = yourShare[0].id - latestValue;
    if(differenceBetweenLatestSeenShareAndNewestShare > 0) {
        chrome.browserAction.setBadgeText({text:"" + differenceBetweenLatestSeenShareAndNewestShare});
    }
    else {
        chrome.browserAction.setBadgeText({text:""});
    }    
}

shareInterval();