<?
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	$file = 'posts.txt';

	if (filesize($file) != 0) {
		$linecount = 0;

		$handle = fopen($file, "r");
		while(!feof($handle)) {
			$line = fgets($handle);
			$linecount++;
		}
		fclose($handle);

		echo $linecount;
	} else {
		echo 0;
	}
