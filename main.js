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
<<<<<<< HEAD
$(window).scroll(function()
{
    if($(window).scrollTop() == $(document).height() - $(window).height())
    {
        $('div#loadmoreajaxloader').show();
        $.ajax({
        url: "viewPosts.php",
        success: function(html)
        {
            if(html)
            {
                $("#board ul").append(html);
                $('div#loadmoreajaxloader').hide();
            }else
            {
                $('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
            }
        }
        });
    }
=======

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
var noLoaded = 0

$(document).ready(function () {
	resizeElm();
	$(window).resize(resizeElm);

	receivePosts();
	setInterval(receivePosts, 2000);
>>>>>>> 2aba30bcfa5fce642f6411b7b245b9832f2e8e7f
});