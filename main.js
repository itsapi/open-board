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
					$.each(posts.items, function (i, item) {
						$('#board ul').append(item);
					});
				});

			} else {
				$('div#loadmore').html('<center>No more posts to show.</center>');
			}
		});
		$('div#loadmore').hide();
    }
});

function receivePosts() {
	var loadMoreContent = '';
	$.get('posts.txt', function(posts) {
		var splitPosts = posts.split('\n');
		$('#board ul').html(function () {
			if (splitPosts.length < defaultLoad) {
				var no = splitPosts.length;
			} else {
				var no = defaultLoad;
			};
			
			var out = '';
			for (var i = splitPosts.length-2; i >= (splitPosts.length - no); i--) {
				out = out + '<li>' + splitPosts[i] + '</li>';
			};
			return out;
		});
	});
}

function resizeElm() {
	$('#post textarea').css('width', $('#post').width()-43);
}

var defaultLoad = 10
var noLoaded = 0

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);

	receivePosts();
	setInterval(receivePosts, 5000);
});