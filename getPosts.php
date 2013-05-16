<?
	exec("sed -n " . $_GET['from'] . "," . $_GET['length'] . "p posts.txt", $out);
	//exec("sed -n " . $_POST['from'] . "," . $_POST['length'] . "p posts.txt", $out);
	//exec("sed -n " . 1 . "," . 5 . "p posts.txt", $out);

	echo json_encode($out);