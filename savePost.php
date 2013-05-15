<?
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	if (file_put_contents('posts', $_POST['postContent'] . '\n', FILE_APPEND | LOCK_EX) == FALSE) {
		echo 'Oops! Post failed.';
	} else {
		echo 'Post was successful.';
	}