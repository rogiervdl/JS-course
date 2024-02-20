<?php 

	// output as JSON
	header('Content-type: application/json'); 

	// path to CSV file
	define('CSV', 'friends.csv');

	// read CSV
	$friendsvals = file(CSV);
	$friends = array();
	foreach ($friendsvals as $friendvals) {
		$vals = explode(',', trim($friendvals));
		$friends[] = array('id' => (int) $vals[0], 'name' => $vals[1], 'age' => (int) $vals[2], 'email' => $vals[3]);
	}

	// returns friend by id
	function getFriendById($friends, $id) {
		foreach ($friends as $friend) {
			if ($friend['id'] == $id) return $friend;
		}
		return null;
	}

	// deletes friend by id
	function deleteFriendById(&$friends, $id) {
		for ($i = 0; $i < count($friends); $i++) {
			if ($friends[$i]['id'] == $id) {
				array_splice($friends, $i, 1);
				return true;
			} 
		}
		return false;
	}

	// writes friends to csv
	function writeToCsv($friends) {
		$csv = array();
		foreach ($friends as $friend) {
			$csv[] = implode(',', array_values($friend));
		}
		file_put_contents(CSV, implode(PHP_EOL, $csv));
	}

	// handle GET, all friends
	if (isset($_GET['all'])) {
		print_r($friends);
		exit(0);
	}

	// handle GET, single friend
	if (isset($_GET['id'])) {
		$friend = getFriendById($friends, $_GET['id']);
		if ($friend == null) {
			http_response_code(404);
		} else {
			print_r($friend);
		}
		exit(0);
	}

	// handle POST
	if (isset($_POST['name']) && isset($_POST['age']) && isset($_POST['email'])) {
		// find new id
		$id = count($friends) == 0 ? 1 : (int) $friends[count($friends) - 1]['id'] + 1;

		// build new friend
		$friends[] = array('id' => $id, 'name' => $_POST['name'], 'age' => $_POST['age'], 'email' => $_POST['email']);

		// write to csv
		writeToCsv($friends);

		// exit 
		exit(0);
	}

	// handle DELETE; because PHP has no DELETE superglobal, we use GET instead
	if (isset($_GET['delete'])) {
		// try to delete friend
		if (!deleteFriendById($friends, $_GET['delete'])) {
			http_response_code(404);
		} else {
			writeToCsv($friends);
		}

		// exit 
		exit(0);
	}

// EOF