/*
 * Page-specific scripts
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 */

	/**
	* Checks the form and sets error messages where necessary
	*
	* @return bool isValid
	*/
	var checkForm = function() {
		// clear error messages
		document.getElementById("errTitle").innerHTML = "";
		document.getElementById("errName").innerHTML = "";
		document.getElementById("errEmail").innerHTML = "";

		// check form
		var isValid = true;

		// title selected?
		if (document.getElementById("title").value == "-1") {
			document.getElementById("errTitle").innerHTML = "gelieve een titel te selecteren";
			isValid = false;
		}

		// name provided?
		if (document.getElementById("name").value == "") {
			document.getElementById("errName").innerHTML = "gelieve een naam op te geven";
			isValid = false;
		}

		// email correct?
		var rex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!rex.test(document.getElementById("email").value)) {
			document.getElementById("errEmail").innerHTML = "incorrect formaat";
			isValid = false;
		}

		// email provided?
		if (document.getElementById("email").value == "") {
			document.getElementById("errEmail").innerHTML = "gelieve een email op te geven";
			isValid = false;
		}

		// return
		return isValid;
	}

	// start scripts
	window.addEventListener('load', function() {
		document.getElementById("frm1").addEventListener('submit', function(e) {
			if (!checkForm()) e.preventDefault();
		});
	});
