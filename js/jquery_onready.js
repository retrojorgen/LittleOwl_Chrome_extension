var listContent = function (tabName, tabContent) {
	var itemcontent = $(tabName);
	chrome.extension.getBackgroundPage().setLatestValueFromPopup();
	itemcontent.children('.share').remove(); //remove all shares
	$.each(tabContent, function(i, field){
		
		var shareContainer = $("<div></div>").addClass("share");
		itemcontent.append(shareContainer);
		var shareUser = $("<span></span>").addClass("user").append("@" + field.twitter_screen_name);
		shareContainer.append(shareUser);
		chrome.extension.getBackgroundPage().isFollower(field.user_id, function (followers) {
			if(followers) {
			} else {
				var addUser = $("<button></button>").addClass("followButton").append("Follow<input class='user_id' type='hidden' value='" + field.user_id + "' />").button();
				shareContainer.append(addUser);						
			}
		}); 		
		var shareDate = $("<span></span>").addClass("date").append(compareDateToNow(dateFromMySQLTimestamp(field.timestamp)));
		shareContainer.append(shareDate);
		var shareMessage = $("<div></div>").addClass("message").append(field.message);
		shareContainer.append(shareMessage);
		var shareButtonsContainer = $("<span></span>").addClass("shareButtonsContainer");
		shareContainer.append(shareButtonsContainer);
		if(field.user_id === chrome.extension.getBackgroundPage().userCredentials.user_id) {
			var shareDeleteButton = $("<button></button>").addClass("shareDeleteButton").append("<span class='ui-icon ui-icon-closethick'></span>" + "<input class='share_id' type='hidden' value='" + field.id + "' />").button();
			shareButtonsContainer.append(shareDeleteButton);
		}
		var shareContent = $("<div></div>").addClass("sharedcontent").append("<img src='http://www.google.com/s2/favicons?domain=" + field.host + "'/>");
		shareContainer.append(shareContent);
		var shareUrl = $("<div></div>").addClass("url").append(field.title + " - " + field.host);
		shareContent.append(shareUrl);				
		var shareHiddenUrl = $("<input type='hidden' />").addClass("openUrl").val(field.url);
		shareContent.append(shareHiddenUrl);
	});	
},
dateFromMySQLTimestamp = function (mySQLTimestampString) {
	mySQLTimestampString = mySQLTimestampString.split(/[- :]/);
	return new Date(mySQLTimestampString[0], mySQLTimestampString[1]-1, mySQLTimestampString[2], mySQLTimestampString[3], mySQLTimestampString[4], mySQLTimestampString[5]);
},
compareDateToNow = function(dateObject) {
	currentDate = new Date();
	var returnNumber = false;	
	if(returnNumber = (currentDate.getYear() > dateObject.getYear()) ? currentDate.getYear() - dateObject.getYear() : false) {
		return returnNumber + " year ago";
	} else {
		if(returnNumber = (currentDate.getMonth() > dateObject.getMonth()) ? currentDate.getMonth() - dateObject.getMonth() : false) {
			return returnNumber + " month ago";
		} else {
			if(returnNumber = (currentDate.getDate() > dateObject.getDate()) ? currentDate.getDate() - dateObject.getDate() : false) {
				return returnNumber + " day ago";		
			} else {
				if(returnNumber = (currentDate.getHours() > dateObject.getHours()) ? currentDate.getHours() - dateObject.getHours() : false) {
					return returnNumber + " hours ago";
				} else {
					if(returnNumber = (currentDate.getMinutes() > dateObject.getMinutes()) ? currentDate.getMinutes() - dateObject.getMinutes() : false) {
						return returnNumber + " minutes ago";					
					} else {
						return "Seconds ago";
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
},
tabs2 = function() {
	var tab2Content = $("#ftabs-1");
	tab2Content.html("<img src='../img/loading.gif' />");
	var getFollowers = $.getJSON('http://www.retrojorgen.com/api.php?type=showfollowers', function(data) {
		tab2Content.empty();
     	$.each(data, function(i, field){
   	  		var followerContent = $("<div></div>").addClass('follower');
			var user = $("<span></span>").addClass('user').append("@" + field.twitter_screen_name);
			var hiddenInput = $("<input type='hidden' class='user_id' name='id' value='" + field.userid +"'>");
			var followButton = $("<button></button>").addClass('followButton').append('Unfollow').append(hiddenInput).button();
			followerContent.append(user).append(followButton);
        	tab2Content.append(followerContent);
        });
	}).error(function() {
		tab2Content.html("<div class='error'>You are not following anyone</div>");
	});
},
tabs3 = function() {
	var tab3Content = $("#tabs-3");
	tab3Content.html("<img src='../img/loading.gif' />");
	chrome.tabs.getSelected(null, function(tab) {
		var shareContent = $(
		"<div>" +
		"<h2>SirFart lets you share</h2><h3>the website your are currently browsing, and add a message. Simple.</h3>" +
		"<ul><li>Url: " + tab.url + "</li><li>Title: " + tab.title + "</li></ul>" +
		"<h3>Add a message</h3><textarea id='sharetext' cols='30' rows='2'></textarea>" +
		"<span id='sharetextcounter'>60</span> characters left" +
		"</div>");
		var shareButton = $("<button id='shareButton'>Share</button>");
		shareButton.button();
		shareContent.addClass("shareTab").append(shareButton);
		tab3Content.html(shareContent);
	});		
},
startListeners = function () {
	$("body").on("keyup", "#sharetext", function() {
		var count = $("#sharetext").val().length;
		$("#sharetextcounter").empty().html(60 - count);
		((60 - count) < 0) ?
			$('#shareButton').html("Too many characters").button({ disabled: true })
		:
			$('#shareButton').html("Share").button({disabled: false});
	}).on("click", ".sharedcontent", function() {
		var url = $(this).children(".openUrl").val();
		chrome.tabs.create({url: url, active : false});	
	}).on("click", ".shareDeleteButton", function () {
		var current = $(this);
		var share_id = current.children("span").children(".share_id").val();
		current.html("<img src='../img/loading.gif' />");
		$.ajax({
			type: "GET",	
	  		url: 'http://www.retrojorgen.com/api.php',
	  		data: {type: "deleteusershare", id: share_id},
	  		dataType: "json",
	  		success: function(data) {
				current.parent().parent().remove();
	  		},
	  		error: function (xhr, ajaxOptions, thrownError) {
	  			console.log(thrownError);
	  		}
		});
	}).on("click", ".splashContent", function () {
		chrome.tabs.create({url: 'http://www.retrojorgen.com/api.php?type=authenticationredirect'});
	}).on("click", "#shareButton", function () {
		$(this).html("<img src='../img/loading.gif' />");
		chrome.tabs.getSelected(null, function(tab) {
			$.ajax({
				type: "POST",	
	  			url: 'http://www.retrojorgen.com/api.php?type=sharelogtodatabase',
	  			data: {url: tab.url, title: tab.title, message: $("#sharetext").val()},
	  			success: function(data) {
			  		console.log(data);
			    	$("#shareButton").html(data.new_status).button({ disabled: true });
  				},
  				error: function (xhr, ajaxOptions, thrownError){
  					console.log(thrownError);
  				}
			});
		});	
	}).on("click", ".followButton", function () {
		var followerid = $(this).children("span").children('.user_id').val();
		var followerString = $(this).children("span").text();		
		console.log(followerid);
		console.log(followerString);
		$(this).html("<img src='../img/loading.gif' />");
		var self = $(this);
		$.ajax({
			type: "GET",	
	  		url: 'http://www.retrojorgen.com/api.php',
	  		data: {type: "followertodatabase", follower: followerid, follow: followerString},
	  		dataType: "json",
	  		success: function(data) {
	  			console.log(data.responce);
				self.button( "option", "disabled", true );
				self.text(data.responce);
	  		},
	  		error: function (xhr, ajaxOptions, thrownError){
	  			console.log(thrownError);
	  		}
		});	
	}).on('tabsselect', function(e, tab) {
			console.log(tab.panel.id);
	        if(tab.panel.id === "tabs-1") {
	        	listContent("#stabs-1",chrome.extension.getBackgroundPage().yourShare);
	        }
	        if(tab.panel.id === "tabs-2") {
	        	tabs2();
	        }
	        if(tab.panel.id === "tabs-3") {
	        	tabs3();
	        }
	        if(tab.panel.id === "stabs-1") {
	        	listContent("#stabs-1",chrome.extension.getBackgroundPage().yourShare);
	        }
	        if(tab.panel.id === "stabs-2") {
	        	listContent("#stabs-2",chrome.extension.getBackgroundPage().allShare);
	        }
	        if(tab.panel.id === "tabs-3") {
	        	tabs3();
	        }                
	});
}

$(document).ready(function() {
	$("#tabs").tabs();
	$("#stabs").tabs();
	$("#ftabs").tabs();
	$("#sharebutton").button();
	if (chrome.extension.getBackgroundPage().yourShare) {
		listContent("#stabs-1",chrome.extension.getBackgroundPage().yourShare);
	}	
	else {
		loginPrompt();
	}
	startListeners();
});