function submitPost() {
	$.ajax('savePost.php', {
		data: document.getElementById('newPost'),
		success: function (data, status, jqXHR){
			alert(data);
		}
	});
}