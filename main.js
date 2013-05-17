function submitPost() {
	var newPost = $('#newPost').val().replace(/\n+/g,"<br>") + '\n';
	$.ajax({
		url: 'savePost.php',
		type: 'post',
		data: {postContent: newPost}
	}).done(function (post){
		loadNew();
		$('#newPost').val('').focus();
	});
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
						$('#board ul').append('<li>' + item + '</li>');
						noLoaded++;
					});
				});

			} else {
				$('div#loadmore').html('<center>No more posts to show.</center>');
			}
		});
		$('div#loadmore').hide();
    }
});

function loadNew(first) {
	if($(window).scrollTop() == 0) {
		$.ajax({
			url: 'noPosts.php',
		}).done(function (fileLength) {
			if (fileLength > noPosts) {
				noPosts = fileLength;
				if (first == 1) {
					var lineFrom = (((fileLength-defaultLoad) < 1) ? 1 : (fileLength-defaultLoad));
					var lineTo = fileLength;
				} else {
					var lineFrom = (noLoaded+1);
					var lineTo = fileLength;
				}
				$.getJSON('getPosts.php', {
					from: lineFrom,
					to: lineTo
				}).done(function(posts) {
					$.each(posts, function (i, item) {
						$('#board ul').prepend('<li>' + item + '</li>');
						noLoaded++;
					});
				});
			}
		});
	}
}

function resizeElm() {
	$('#post textarea').css('width', $('#post').width()-43);
}

var defaultLoad = parseInt($(window).height()/50);
var noLoaded = 0;
var noPosts = 0;

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);

	loadNew(1);
	setInterval(loadNew, 5000);
});