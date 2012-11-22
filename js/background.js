var iconstatus = false, 
yourShare = false,
allShare = false, 
latestValue = 0,
userCredentials = false,
yourFollowers = new Array(),
shareInterval = function () {
    setInterval(function() { 
        getYourShareLogFromXMLHttpRequest(function(output, shares) {
            if(output) {
                yourShare = shares;
                if(latestValue === 0) {
                        latestValue = yourShare[0].id;
                }
                getAllShareLogFromXMLHttpRequest(function(output, shares) {
                    if(output) {
                        allShare = shares;
                        setUserCredentials(function(output, credentials) {
                            if(output) {
                                userCredentials = credentials;
                                getFollowers(function(followerArray) {
                                    if(followerArray) {
                                        yourFollowers = followerArray;
                                        yourFollowers[userCredentials.user_id] = userCredentials.user_id;
                                        chrome.browserAction.setIcon({path: '../img/icon_online.png'});                                    
                                    } else {
                                        console.log("Service not available");
                                    }
                                });
                            } else {
                                console.log("failed to get user credentials");
                            } 
                        });                        
                        updateBadgeStatus();                        
                    } else {
                        console.log("failed to get all share");
                    }
                });
            } else {
                console.log("failed to get your share");
            }
        });
    }, 5000);
},
getFollowers = function(callback) {
    getFollowersFromXMLHttpRequest(function(output, followers) {
        if(output) {
            var followerArray = new Array();
            for (var key in followers) {
                var follower = followers[key];
                followerArray[follower.userid] = follower.twitter_screen_name;
            }
            callback(followerArray);
        }
         else {
            callback(false);   
        }
    });
},
isFollower = function (follower, callback) {
    console.log(yourFollowers);
    if(yourFollowers[follower]) {
        callback(true);
    } else {
        callback(false);
    }
    
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
getYourShareLogFromXMLHttpRequest = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/api.php?type=showshare", function(output) {
        if(output) {          
            callback(true, JSON.parse(output));
        }
        else {
            callback(false, false);
        }      
    });
},
getAllShareLogFromXMLHttpRequest = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/api.php?type=showshare&status=all", function(output) {
        if(output) {
            callback(true, JSON.parse(output));
        }
        else {
            callback(false, false);
        }
    });
},
getFollowersFromXMLHttpRequest = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/api.php?type=showfollowers", function(output) {
        if(output) {
            callback(true, JSON.parse(output));
        }
        else {
            callback(false);
        }    
    });
},
setUserCredentials = function (callback) {
    doXMLhttpRequest("GET","http://www.retrojorgen.com/api.php?type=getusercredentials", function(output) {
        if(output) {
            callback(true, JSON.parse(output));
        }
        else {
            callback(false);
        }    
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
