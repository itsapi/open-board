<?
    $out = array_slice(file('posts.txt'), $_GET['from']-1, $_GET['to']);

	foreach ($out as $i => $post) {
		$out[$i] = explode(':', $post, 2);
	}

	echo json_encode($out);