function submitPost() {
	var newPost = $('#newPost').val().replace(/\n+/g,"<br>") + '\n';
	$.ajax({
		url: 'savePost.php',
		type: 'post',
		data: {postContent: newPost}
	}).done(function (post){
		loadNew();
		$('#newPost').val('');
	});
}

$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        $('div#loadmore').show();
        $.ajax({
			url: 'noPosts.php',
		}).done(function(noLines) {
			totalLines = noLines;
			if (noLoaded < noLines) {
				if (noLoaded + defaultLoad < noLines) {
					noLines = noLoaded + defaultLoad;
				}
				$.getJSON('getPosts.php', {
					from: totalLines - noLoaded - noLines,
					length: noLines
				}).done(function(posts) {
					$.each(posts, function (i, item) {
						$('#board ul').append('<li>' + item + '</li>');
						noLoaded++
					});
				});

			} else {
				$('div#loadmore').html('<center>No more posts to show.</center>');
			}
		});
		$('div#loadmore').hide();
    }
});

function loadNew() {
	if($(window).scrollTop() == 0) {
		$.ajax({
			url: 'noPosts.php',
		}).done(function (fileLength) {
			if (fileLength > noLoaded) {
				$.getJSON('getPosts.php', {
					from: (noLoaded+1),
					length: (fileLength-noLoaded)
				}).done(function(posts) {
					$.each(posts, function (i, item) {
						$('#board ul').prepend('<li>' + item + '</li>');
						noLoaded++
					});
				});
			}
		});
	}
}

function resizeElm() {
	$('#post textarea').css('width', $('#post').width()-43);
}

var defaultLoad = 10
var noLoaded = 0

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);

	loadNew();
	setInterval(loadNew, 5000);
});