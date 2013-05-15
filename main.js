function submitPost() {
	var newPost = $('#newPost').val().replace(/\n+/g,"<br>") + '\n';
	$('#newPost').val('');
	$.ajax({
		url: 'savePost.php',
		type: 'post',
		data: {postContent: newPost},
		success: function (post){
			receivePosts();
		}
	});
}

function receivePosts() {
	$.get('posts.txt', function(posts) {
		var splitPosts = posts.split('\n');
		$('#board ol').html(function () {
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

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);
	receivePosts();

	setInterval(receivePosts, 2000);
});