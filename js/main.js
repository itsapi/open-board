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
		};
		if ($('#newPost').val().length >= 142) {
			msg += 'Your post must not be more than 142 characters.\n';
		};
		alert(msg);
	};
};

$(window).scroll(function() {
	if($(window).scrollTop() == $(document).height()-$(window).height()) {
		$('#board ul').addClass('loading');
		$.ajax({
			url: 'noPosts.php',
		}).done(function(noLines) {
			totalLines = noLines;
			if (noLoaded < noLines) {
				if (totalLines-noLoaded < defaultLoad) {
					noLines = (totalLines-noLoaded);
				} else {
					noLines = defaultLoad;
				};
				$.getJSON('getPosts.php', {
					from: (((totalLines-noLoaded-noLines-1) < 1) ? 1 : (totalLines-noLoaded-noLines-1)),
					to: (totalLines-noLoaded-1)
				}).done(function(posts) {
					$.each(posts.reverse(), function (i, item) {
						$('#board ul').append('<li>' + displayPost(item) + '</li>');
						$('#board li:last-child').emoticonize();
						noLoaded++;
					});
					$('#board li').emoticonize();
				});
				$('#board ul').removeClass('loading');
			} else {
				$('#board ul').addClass('empty');
			};
		});
	};

	if($(window).scrollTop() > $(window).height()) {
		$('div#top').css('bottom', 0);
	} else {
		$('div#top').css('bottom', -50);
	}
});

function loadNew(first) {
	if($(window).scrollTop() == 0) {
		$.ajax({
			url: 'noPosts.php',
		}).done(function (fileLength) {
			if ((fileLength <= noPosts) || (first == 1)) {
				var lineFrom = (((fileLength-defaultLoad) < 1) ? 1 : (fileLength-defaultLoad));
			} else {
				var lineFrom = (fileLength-(fileLength-noPosts));
			};
			var lineTo = fileLength;
			$.getJSON('getPosts.php', {
				from: lineFrom,
				to: lineTo
			}).done(function(posts) {
				if (fileLength > noPosts) {
					$.each(posts, function (i, item) {
						$('#board ul').prepend('<li>' + displayPost(item) + '</li>');
						$('#board li:first-child').emoticonize();
						noLoaded++;
						if (first != 1) {
							$('#board li:last-child').remove();
							noLoaded--;
						};
					});
				} else {
					var postsToDelete = (noLoaded-defaultLoad);
					for (var i=0; i<=(postsToDelete); i++) {
						$('#board li:last-child').remove();
						noLoaded--;
					};
					$.each($('#board li').get().reverse(), function (i) {
						$(this).children('time').html(timeDifference(posts[i+1][0]));
					});
				};
				noPosts = fileLength;
			});
		});
	};
};

function timeDifference(previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var current = Date.now();
	var elapsed = current - previous*1000;

	var plural = 's'
	if (elapsed < msPerMinute) {
		if (Math.round(elapsed/1000) == 1) {plural = ''};
		return Math.round(elapsed/1000) + ' Second' + plural + ' ago';
	} else if (elapsed < msPerHour) {
		if (Math.round(elapsed/msPerMinute) == 1) {plural = ''};
		return Math.round(elapsed/msPerMinute) + ' Minute' + plural + ' ago';
	} else if (elapsed < msPerDay ) {
		if (Math.round(elapsed/msPerHour) == 1) {plural = ''};
		return Math.round(elapsed/msPerHour ) + ' Hour' + plural + ' ago';
	} else if (elapsed < msPerMonth) {
		if (Math.round(elapsed/msPerDay) == 1) {plural = ''};
		return Math.round(elapsed/msPerDay) + ' Day' + plural + ' ago';
	} else if (elapsed < msPerYear) {
		if (Math.round(elapsed/msPerMonth) == 1) {plural = ''};
		return Math.round(elapsed/msPerMonth) + ' Month' + plural + ' ago';
	} else {
		if (Math.round(elapsed/msPerYear) == 1) {plural = ''};
		return Math.round(elapsed/msPerYear ) + ' Year' + plural + ' ago';
	};
};

function displayPost(item) {
	var date = new Date(item[0] * 1000).format('Y-m-d H:i') // YYYY-MM-DDTHH:MM
	return ('<time datetime="' + date + '">' + timeDifference(item[0]) + '</time> ') + item[1].replace(exp,"<a class=\"no-emoticons\" href='$1'>$1</a>");
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

function resizeElm() {
	$('#newPost').css('width', $('h1').width()-23);
};

var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
var defaultLoad = parseInt($(window).height()/50);
var noLoaded = 0;
var noPosts = 0;

preload(['ajax-loader.gif']);

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