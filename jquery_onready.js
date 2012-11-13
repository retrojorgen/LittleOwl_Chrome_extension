var listContent = function () {
		var item1content = $("#tabs-1");
		item1content.empty();
		$.each(chrome.extension.getBackgroundPage().share, function(i, field){
			var shareClass = "share";
			if(field.id > chrome.extension.getBackgroundPage().latestValue) {
				var shareClass = "share new";
			}
			item1content.append(
				"<div class='share'>" +
					"<span class='user'>@" +
						field.twitter_screen_name + 
					"</span>" +
					"<span class='date'> - " +
						compareDateToNow(dateFromMySQLTimestamp(field.timestamp)) +
					"</span>" +
					"<div class='message'>" +
						field.message + 
					"</div>" +				
					"<div class='sharedcontent'><img src='http://www.google.com/s2/favicons?domain=" + 
						field.host + 
					"'/>" + 
					"<div class='url'>" +
						field.title + 
						" - " + 
						field.host +
						"<input type='hidden' class='openurl' value='" + 
							field.url +
						"'/>" +	
					"</div>" +
					"<div class='separatorLine'>" +
					"</div>" +
				"</div>");
		});

},
dateFromMySQLTimestamp = function (mySQLTimestampString) {
	mySQLTimestampString = mySQLTimestampString.split(/[- :]/);
	return new Date(mySQLTimestampString[0], mySQLTimestampString[1]-1, mySQLTimestampString[2], mySQLTimestampString[3], mySQLTimestampString[4], mySQLTimestampString[5]);
},
compareDateToNow = function(dateObject) {
	currentDate = new Date();
	
	if(currentDate.getYear() > dateObject.getYear()) {
		return (currentDate.getYear() - dateObject.getYear() + " year ago");
	}
	else {
		if(currentDate.getMonth() > dateObject.getMonth()) {
			return (currentDate.getMonth() - dateObject.getMonth() + " month ago");
		} else {
			if(currentDate.getDay() > dateObject.getDay()) {
				return (currentDate.getDay() - dateObject.getDay() + " day ago");
			
			} else {
				if(currentDate.getHours() > dateObject.getHours()) {
					return (currentDate.getHours() - dateObject.getHours() + " hours ago");
				} else {
					if(currentDate.getMinutes() > dateObject.getMinutes()) {
						return (currentDate.getMinutes() - dateObject.getMinutes() + " minutes ago");					
					}
				}
			}	
			
		}
	}
	
	return false;
},
loginPrompt = function () {
			$("body").append("<div id='light' class='white_content'></div><div id='fade' class='black_overlay'></div>");
			$(".white_content").append("Unfortunately, you need to log in.<br /><br /><img src='sign_in_with_twitter.png' class='authenticate'>");	
}

$(document).ready(function() {
	$("#tabs").tabs();
	$("#button").tabs();
	chrome.extension.getBackgroundPage().getCookieStatus(function (logged) {
		if (logged) listContent();
		else loginPrompt();
	});	
});