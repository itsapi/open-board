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
});