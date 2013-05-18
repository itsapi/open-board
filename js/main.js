function submitPost() {
	if (($('#newPost').val() != '') && ($('#newPost').val().length < 142)) {
		var newPost = $('#newPost').val().replace(/\n+/g,"<br>") + '\n';
		$.ajax({
			url: 'savePost.php',
			type: 'post',
			data: {postContent: newPost}
		}).done(function (post){
			loadNew();
			$('#newPost').val('').focus();
		});
	} else {
		var msg = '';
		if ($('#newPost').val() == '') {
			msg += 'Your post cannot be blank.\n';
		}
		if ($('#newPost').val().length >= 142) {
			msg += 'Your post must not be more than 142 characters.\n';
		}
		alert(msg);
	}
}

$(window).scroll(function() {
	if($(window).scrollTop() == $(document).height()-$(window).height()) {
		$('div#loadmore').show();
		$.ajax({
			url: 'noPosts.php',
		}).done(function(noLines) {
			totalLines = noLines;
			if (noLoaded < noLines) {
				if (totalLines-noLoaded < defaultLoad) {
					noLines = (totalLines-noLoaded);
				} else {
					noLines = defaultLoad;
				}
				$.getJSON('getPosts.php', {
					from: (((totalLines-noLoaded-noLines-1) < 1) ? 1 : (totalLines-noLoaded-noLines-1)),
					to: (totalLines-noLoaded-1)
				}).done(function(posts) {
					$.each(posts.reverse(), function (i, item) {
						$('#board ul').append('<li>' + displayPost(item) + '</li>');
						noLoaded++;
					});
					$('#board li').emoticonize();
				});
				$('div#loadmore').hide();
			} else {
				$('div#loadmore').html('<center>No more posts to show.</center>');
			}
		});
	}

	if($(window).scrollTop() > $(window).height()) {
		$('div#top').show();
	} else {
		$('div#top').hide();
	}
});

function loadNew() {
	if($(window).scrollTop() == 0) {
		$.ajax({
			url: 'noPosts.php',
		}).done(function (fileLength) {
			var lineFrom = (fileLength-defaultLoad);
			var lineTo = fileLength;
			$.getJSON('getPosts.php', {
				from: lineFrom,
				to: lineTo
			}).done(function(posts) {
				$('#board ul').html('');
				$.each(posts, function (i, item) {
					$('#board ul').prepend('<li>' + displayPost(item) + '</li>');
					noLoaded++;
				});
				$('#board li').emoticonize();
			});
		});
	}
}

function timeDifference(previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var current = Date.now();
	var elapsed = current - previous*1000;

	if (elapsed < msPerMinute) {
		 return Math.round(elapsed/1000) + ' seconds ago';   
	} else if (elapsed < msPerHour) {
		 return Math.round(elapsed/msPerMinute) + ' minutes ago';   
	} else if (elapsed < msPerDay ) {
		 return Math.round(elapsed/msPerHour ) + ' hours ago';   
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed/msPerDay) + ' days ago';   
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed/msPerMonth) + ' months ago';   
	} else {
		return Math.round(elapsed/msPerYear ) + ' years ago';   
	}
}

function displayPost(item) {
	return timeDifference(item[0]) + ' - ' + item[1].replace(exp,"<a class=\"no-emoticons\" href='$1'>$1</a>");
}

function resizeElm() {
	$('#newPost').css('width', $('#post').width()-23);
}

var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
var defaultLoad = parseInt($(window).height()/50);
var noLoaded = 0;

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);
	$('#post h1').fitText();

	$('div#top').click(function() {
		$('html, body').animate({ scrollTop: 0 }, 'slow');
		return false;
	});

	loadNew(1);
	setInterval(loadNew, 5000);
});