<?
	if (file_put_contents('posts.txt', $_POST['postContent'], FILE_APPEND | LOCK_EX) == FALSE) {
		echo 'Oops! Post failed.';
	} else {
		echo 'Post was successful.';
	}