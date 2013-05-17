<?
	exec("sed -n " . $_GET['from'] . "," . $_GET['to'] . "p posts.txt", $out);

	foreach ($out as $i => $post) {
		$out[$i] = explode(':', $post, 2);
	}

	echo json_encode($out);