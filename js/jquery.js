var url = "", title = "", host = "", time = "",

tabs2 = function() {
	var tab2Content = $("#ftabs-1");
	tab2Content.html("<img src='../img/loading.gif' />");
	var getFollowers = $.getJSON('http://www.retrojorgen.com/showfollowersJSON.php', function(data) {
		tab2Content.empty();
     	$.each(data, function(i, field){
        		tab2Content.append("<div class='follower'>@" + field.twitter_screen_name + "<input type='hidden' class='followerid' name='id' value='" + field.user_id +"'><input type='button' class='cupid-blue follow' value='unFollow'></div>");
        });
	}).error(function() {
		//tab2Content.children("#tabs-2Content").("<div class='error'>You are not following anyone</div>");
	});
},
tabs3 = function() {
	var tab3Content = $("#tabs-3Content");
	tab3Content.html("<img src='../img/loading.gif' />");
	chrome.tabs.getSelected(null, function(tab) {
		tab3Content.html("<div class='share'>" + 
		"Share this url?<br/>" + 
		"<ul><li>Url: " + tab.url + "</li><li>Title: " + tab.title + "</li></ul>" +
		"<span>Max 60 characters</span><br />" +
		"<textarea id='sharetext' cols='30' rows='2'></textarea>" +
		"<span id='sharetextcounter'>60</span> characters left" +
		"<div id='shareButtonContent'><button id='sharebutton'>Share</button></div>" +
		"</div>");
	});		
}
$("#tabs").bind("tabsselect", function(e, tab) {
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

$(".cupid-blue.follow").live({
	click: function() {
		var current = $(this);
		var followerid = current.parent().children(".followerid").val();
		var followerstring = current.val();
		$(this).empty().html("<img src='../img/loading.gif' />");
		$.ajax({
			type: "GET",	
	  		url: 'http://www.retrojorgen.com/followerLogToDatabase.php',
	  		data: {follower: followerid, follow: followerstring},
	  		dataType: "json",
	  		success: function(data) {
				console.log(data);
	  		},
	  		error: function (xhr, ajaxOptions, thrownError){
	  		}
		});	
	}
});

$(".authenticate").live({
	click: function() {
		chrome.tabs.create({url: 'http://www.retrojorgen.com/auth_redirect.php'});
	}
});


$("#sharebutton").live({
	click: function() {
		$("#shareButtonContent").html("<img src='../img/loading.gif' />");
		chrome.tabs.getSelected(null, function(tab) {
			$.ajax({
			type: "POST",	
		  	url: 'http://www.retrojorgen.com/shareLogToDatabase.php',
		  	data: {url: tab.url, title: tab.title, message: $("#sharetext").val()},
		  	success: function(data) {
		  		console.log(data);
		    	$("#shareButtonContent").html("<div>" + data.new_status + "</div>");
	  		},
	  		error: function (xhr, ajaxOptions, thrownError){
	  			console.log("error happened");
	  		}
			});
		});	
	}
});


$('#sharetext').live({
	keyup: function() {
		var count = $("#sharetext").val().length;
		$("#sharetextcounter").empty().html(60 - count);		
		if((60 - count) < 0){
			$('#shareButtonContent').html("Too many characters");	
		}
		else {
			$('#shareButtonContent').html("<button id='sharebutton'>Share</button>");
		}
	}
});

$(".sharedcontent").live({
	click: function() {
		var url = $(this).children(".openUrl").val();
		chrome.tabs.create({url: url, active : false});	
	}
});
$(".splashContent").live({
	click: function() {
		chrome.tabs.create({url: 'http://www.retrojorgen.com/auth_redirect.php'});	
	}
});