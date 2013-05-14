function submitPost() {
	var postContent = $('#newPost').val()
	$.ajax({
		url: 'savePost.php',
		data: postContent,
		success: function (data, status, jqXHR){
			alert(data);
		}
	});
}