function submitPost() {
	$.ajax({
		url: 'savePost.php',
		data: $('textarea#newPost').val(),
		success: function (data, status, jqXHR){
			alert(data);
		}
	});
}