/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

 	// getElementById shorthand
 	var $ = function(id) {
 		return document.getElementById(id);
 	}

	/**
	* Checks the form and sets error messages where necessary
	*
	* @return bool isValid
	*/
	var checkForm = function() {
		// clear error messages
		$("errTitle").innerHTML = "";
		$("errName").innerHTML = "";
		$("errEmail").innerHTML = "";

		// check form
		var isValid = true;

		// title selected?
		if ($("title").value == "-1") {
			$("errTitle").innerHTML = "gelieve een titel te selecteren";
			isValid = false;
		}

		// name provided?
		if ($("name").value == "") {
			$("errName").innerHTML = "gelieve een naam op te geven";
			isValid = false;
		}

		// email correct?
		var rex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!rex.test($("email").value)) {
			$("errEmail").innerHTML = "incorrect formaat";
			isValid = false;
		}

		// email provided?
		if ($("email").value == "") {
			$("errEmail").innerHTML = "gelieve een email op te geven";
			isValid = false;
		}

		// return
  		return isValid;
	}

	// start scripts
	window.addEventListener('load', function() {
		$("frm1").addEventListener('submit', function(e) {
			if (!checkForm()) e.preventDefault();
		});
	});
