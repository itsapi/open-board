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

$(window).scroll(function()
{
    if($(window).scrollTop() == $(document).height() - $(window).height())
    {
        $('div#loadmore').show();
        receivePosts(noLoaded + defaultLoad);
    }
});

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