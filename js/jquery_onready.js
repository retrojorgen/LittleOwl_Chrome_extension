var listContent = function () {
		var itemcontent = $("#stabs-1");
		chrome.extension.getBackgroundPage().setLatestValueFromPopup();
		itemcontent.children('.share').remove(); //remove all shares
		$.each(chrome.extension.getBackgroundPage().yourShare, function(i, field){
			itemcontent.append(
				"<div class='share'>" +
					"<span class='user'>@" +
						field.twitter_screen_name + 
					"</span>" +
					"<span class='date'>" +
						compareDateToNow(dateFromMySQLTimestamp(field.timestamp)) +
					"</span>" +
					"<div class='message'>" +
						field.message + 
					"</div>" +				
					"<div class='sharedcontent'>" + 
						"<img src='http://www.google.com/s2/favicons?domain=" + 
						field.host + 
						"'/>" + 
						"<div class='url'>" +
							field.title + 
							" - " + 
							field.host +
						"</div>" + 	
						"<input type='hidden' class='openUrl' value='" + 
						field.url +
						"'/>" +	
					"</div>" +
				"</div>");
		});

}
var listAllContent = function () {
		var itemcontent = $("#stabs-2");
		itemcontent.children('.share').remove(); //remove all shares
		$.each(chrome.extension.getBackgroundPage().allShare, function(i, field){
			itemcontent.append(
				"<div class='share'>" +
					"<span class='user'>@" +
						field.twitter_screen_name + 
					"</span>" +
					"<span class='date'>" +
						compareDateToNow(dateFromMySQLTimestamp(field.timestamp)) +
					"</span>" +
					"<div class='message'>" +
						field.message + 
					"</div>" +				
					"<div class='sharedcontent'>" + 
						"<img src='http://www.google.com/s2/favicons?domain=" + 
						field.host + 
						"'/>" + 
						"<div class='url'>" +
							field.title + 
							" - " + 
							field.host +
						"</div>" + 	
						"<input type='hidden' class='openUrl' value='" + 
						field.url +
						"'/>" +	
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
			$("body").append("<div id='light' class='splashContent'></div><div id='fade' class='black_overlay'></div>");
			$(".splashContent").append("<img src='../img/sirfart_splashscreen.png'>");	
}

$(document).ready(function() {
	$("#tabs").tabs();
	$("#stabs").tabs();
	$("#ftabs").tabs();
	$("#sharebutton").button();
	if (chrome.extension.getBackgroundPage().yourShare) {
		listContent();
	}	
	else {
		loginPrompt();
	}
});