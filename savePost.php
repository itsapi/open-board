<?
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	if (file_put_contents('posts.txt', time() . ':' . $_POST['postContent'], FILE_APPEND | LOCK_EX) == FALSE) {
		echo '0';
	} else {
		echo '1';
	}