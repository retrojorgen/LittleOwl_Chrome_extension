var url = "", title = "", host = "", time = "",
tabs1 = function() {
	listContent();
},
tabs2 = function() {
	var tab2Content = $("#tabs-2");
	tab2Content.empty().html("<img src='loading.gif' />");
	var getFollowers = $.getJSON('http://www.retrojorgen.com/showfollowersJSON.php', function(data) {
		tab2Content.empty();
     	$.each(data, function(i, field){
        		tab2Content.append("<div class='follower'>@" + field.twitter_screen_name + "<input type='hidden' class='followerid' name='id' value='" + field.user_id +"'><input type='button' class='cupid-blue follow' value='unFollow'></div>");
        });
	}).error(function() {
		tab2Content.html("<div class='error'>You are not following anyone</div>");
	});
},
tabs3 = function() {
	var tab3Content = $("#tabs-3");
	tab3Content.empty().html("<img src='loading.gif' />");
	chrome.tabs.getSelected(null, function(tab) {
		tab3Content.empty().html("<div class='share'>" + 
		"Share this url?<br/>" + 
		"<ul><li>Url: " + tab.url + "</li><li>Title: " + tab.title + "</li></ul>" +
		"<span>Max 60 characters</span><br />" +
		"<textarea id='sharetext' cols='30' rows='2'></textarea>" +
		"<span id='sharetextcounter'>60</span> characters left" +
		"<div id='sharebutton'><button id="shareButton">Share</button></div>" +
		"</div>");
	});		
}
$("#tabs").bind("tabsselect", function(e, tab) {
		console.log(tab);
        if(tab.index === 0) {
        	console.log("tab-1");
        	tabs1();
        }
        if(tab.index === 1) {
        	console.log("tab-2");
        	tabs2();
        }
        if(tab.index === 2) {
        	console.log("tab-2");
        	tabs3();
        }        
});
$(".cupid-blue.follow").live({
	click: function() {
		var current = $(this);
		var followerid = current.parent().children(".followerid").val();
		var followerstring = current.val();
		$(this).empty().html("<img src='loading.gif' />");
		$.ajax({
			type: "GET",	
	  		url: 'http://www.retrojorgen.com/followerLogToDatabase.php',
	  		data: {follower: followerid, follow: followerstring},
	  		dataType: "json",
	  		success: function(data) {
				console.log(data);
				current.val("hepp");
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


$("#shareButton").live({
	click: function() {
		$("#sharebutton").empty().html("<img src='loading.gif' />");
		chrome.tabs.getSelected(null, function(tab) {
			$.ajax({
			type: "POST",	
		  	url: 'http://www.retrojorgen.com/shareLogToDatabase.php',
		  	data: {url: tab.url, title: tab.title, message: $("#sharetext").val()},
		  	success: function(data) {
		  		console.log(data);
		    	$('#sharebutton').html("<div>" + data.new_status + "</div>");
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
			$('#sharebutton').html("Too many characters");	
		}
		else {
			$('#sharebutton').html("<button class='cupid-blue share'>Share</button>");
		}
	}
});

$(".sharedcontent").live({
	click: function() {
		var url = $(this).children(".openurl").val();
		chrome.tabs.create({url: url});	
	}
});