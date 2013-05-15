function submitPost() {
	$.ajax({
		url: 'savePost.php',
		type: 'post',
		data: {postContent: $('#newPost').val()},
		success: function (post){
			alert(post);
		}
	});
}