function submitPost() {
	var newPost = $('#newPost').val().replace(/\n+/g,"<br>") + '\n';
	$.ajax({
		url: 'savePost.php',
		type: 'post',
		data: {postContent: newPost},
		success: function (post){
			receivePosts();
		}
	});
}

function receivePosts(noRequest) {
	noRequest = typeof noRequest !== 'undefined' ? noRequest : defaultLoad;
	var loadMoreContent = '';
	$.get('posts.txt', function(posts) {
		var splitPosts = posts.split('\n');
		$('#board ul').html(function () {
			if (splitPosts.length < noRequest) {
				var no = splitPosts.length;
			} else {
				var no = noRequest;
			};
			
			var out = '';
			for (var i = splitPosts.length-2; i >= (splitPosts.length - no); i--) {
				out = out + '<li>' + splitPosts[i] + '</li>';
			};
			return out;
		});
	});
	$('div#loadmore').hide();
	noLoaded = noRequest;
}

function loadNew() {
	if($(window).scrollTop() == 0) {
		$.ajax({
			url: 'noPosts.php',
			type: 'post'
		}).done(function (fileLength) {
			if (fileLength > noLoaded) {
				$.getJSON('getPosts.php', {
					from: (noLoaded+1),
					length: (fileLength-noLoaded)
				}).done(function(posts) {
					$.each(posts, function (i, item) {
						$('#board ul').prepend('<li>' + item + '</li>');
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