<?
	exec("sed -n " . $_GET['from'] . "," . $_GET['to'] . "p posts.txt", $out);

	echo json_encode($out);