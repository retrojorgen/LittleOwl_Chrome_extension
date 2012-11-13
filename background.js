var iconstatus = false, 
share = false, 
latestValue = 0,
shareInterval = setInterval(function() { 
    setShareLogFromXMLHttpRequest();
    if(latestValue === 0) {
        latestValue = share[0].id;
    }
    SetBadgeStatus();
    console.log(latestValue);
    console.log(share[0].id);
}, 5000),
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
        }
    }
},
getLatestValue = function() {
    return latestValue;
}, 
setLatestValueFromPopup = function () {
    latestValue = share[0].id;
},
setShareLogFromXMLHttpRequest = function () {
    //SetBadgeStatus();
    doXMLhttpRequest("GET","http://www.retrojorgen.com/showshareJSON.php", function(output) {
        share = JSON.parse(output);    
    });
},
SetBadgeStatus = function () {
    chrome.browserAction.setBadgeBackgroundColor({color:[59, 154, 243, 230]});
    var differenceBetweenLatestSeenShareAndNewestShare = share[0].id - latestValue;
    if(differenceBetweenLatestSeenShareAndNewestShare > 0) chrome.browserAction.setBadgeText({text: "" + differenceBetweenLatestSeenShareAndNewestShare});
    else chrome.browserAction.setBadgeText({text:""});
},
getCookieStatus = function (callback) {
    chrome.cookies.get({url:"http://www.retrojorgen.com", name:"twitterauth"}, function(cookie){
        if(cookie) {callback(true); }
        else { callback(false); }
    });
}
setShareLogFromXMLHttpRequest();
getCookieStatus(function (status) {
    if(status) chrome.browserAction.setIcon({path: 'icon_online.png'});
});

// listen if a cookie is set
chrome.cookies.onChanged.addListener(function(info) {
  if(info.cookie.domain === "www.retrojorgen.com" && info.cookie.name === "twitterauth") {
    iconstatus = true;
    chrome.browserAction.setIcon({path: 'icon_online.png'});
  }
});