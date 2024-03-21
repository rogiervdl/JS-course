/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
/**
 * Falling cube script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@kahosl.be>
 */

// scene
let camera, scene, renderer;

// objects
let plane;
const cubes = [[], [], [], [], [], [], [], [], []];

// physics constants
const damping = 0.5;
const minSpeedBeforeStop = 10;

// dimensions and spacing of cubes
const size = 50;
const spacing = 10;

// players
const PLAYER1 = 1;
const PLAYER2 = 2;
let player = PLAYER1;

/**
 * Main animation loop
 *
 */
function animate() {
	requestAnimationFrame(animate);
	render();
}

/**
 * Initializes the game
 *
 */
function init() {
	// create scene
	scene = new THREE.Scene();

	// add camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(0, 500, 500);

	// add spotlight 1
	const spotlight1 = new THREE.SpotLight();
	spotlight1.position.set(250, 600, 500);
	spotlight1.target.position.set(0, 0, 0);
	spotlight1.castShadow = true;
	scene.add(spotlight1);

	// add spotlight 2
	const spotlight2 = new THREE.SpotLight(0xffffff, 0.1);
	spotlight2.position.set(-500, 2000, 500);
	spotlight2.target.position.set(0, 0, 0);
	spotlight2.castShadow = true;
	scene.add(spotlight2);

	// add plane
	plane = new THREE.Mesh(
		new THREE.PlaneGeometry(1200, 600, 8, 8),
		new THREE.MeshLambertMaterial({ color: 0xffcc55, wireframe: false })
	);
	plane.position.set(0, 0, 0);
	plane.castShadow = false;
	plane.receiveShadow = true;
	plane.rotation.x = -Math.PI / 2;
	scene.add(plane);

	// aim camera
	camera.lookAt(plane.position);

	// create renderer and attach to DOM
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	document.querySelector('#viewport').appendChild(renderer.domElement);

	// find all buttons
	const buttons = document.querySelectorAll('#buttons input');

	// create audio context
	const audioContext = new AudioContext();

	// attach events to all buttons
	for (let j = 0; j < buttons.length; j++) {
		(function() {
			const i = j;
			buttons[i].addEventListener('click', function() {
				// add cube
				const cube = new THREE.Mesh(
					new THREE.CubeGeometry(size, size, size),
					new THREE.MeshLambertMaterial({ color: (player == 1 ? 0x0000FF : 0xFF0000) })
				);
				cube.castShadow = true;
				cube.position.set(i * (size + spacing) - 4 * (size + spacing), 400, 0);

				// init physics
				cube.speedY = 0;
				cube.accY = 4;

				// create boing
				cube.boing = new Audio('snd/boing.wav');

				// create oscillator
				cube.oscillator = audioContext.createOscillator();
				cube.oscillator.frequency.value = 2000;
				cube.oscillatorInc = 60;

				// create amp and mute
				cube.amp = audioContext.createGain();
				cube.amp.gain.value = 0;
				cube.ampInc = 0.1;

				// connect oscillator to amp, and amp to output
				cube.oscillator.connect(cube.amp);
				cube.amp.connect(audioContext.destination);

				// start oscillator
				cube.oscillator.start();

				// add cube to scene
				scene.add(cube);

				// disable the button
				this.disabled = true;

				// remember the button for this cube, so that it can re-enabled later when the cube has finished falling
				cube.button = this;

				// remember which player this cube belongs to
				cube.player = player;
				player = player == PLAYER1 ? PLAYER2 : PLAYER1;

				// add to array
				cubes[i].push(cube);
			});
		})();
	}
}

/**
 * Renders the scene
 *
 */
function render() {
	// iterate towers
	for (let i = 0; i < cubes.length; i++) {
		// iterate cubes of a tower
		const cubestack = cubes[i];
		for (let j = 0; j < cubestack.length; j++) {
			// adjust cube position and speed
			const cube = cubestack[j];
			cube.position.y -= cube.speedY;
			cube.speedY += cube.accY;

			// adjust amp gain & oscillator frequency
			cube.amp.gain.value += cube.ampInc;
			cube.oscillator.frequency.value -= cube.oscillatorInc;

			// cube bounces?
			if (cube.position.y < size / 2 + size * j) {
				// stop whooshing sound
				cube.ampInc = 0;
				cube.oscillatorInc = 0;
				cube.amp.gain.value = 0;

				// change direction and damp
				cube.speedY = -1 * cube.speedY * damping;
				cube.position.y = size / 2 + size * j;

				// cube is slow enough to stop
				if (Math.abs(cube.speedY) <= minSpeedBeforeStop) {
					// stop cube and re-enable button
					cube.speedY = 0;
					cube.accY = 0;
					cube.button.disabled = false;

					// check game
					checkGame();
				}

				// play 'boing' sound
				cube.boing.currentTime = 0;
				cube.boing.play();
			}
		}
	}

	// re-render scene
	renderer.render(scene, camera);
}

/**
 * Checks if a player has four in a row
 *
 */
function checkGame() {
	// find highest number of cubes in a single column
	let maxHeight = 0;
	for (let i = 0; i < cubes.length; i++) {
		if (cubes[i].length > maxHeight) maxHeight = cubes[i].length;
	}

	// check vertical four-in-a-rows
	for (let i = 0; i < cubes.length; i++) {
		// streak for player 1 and 2
		let streak1 = 0;
		let streak2 = 0;

		// if streak of 4 found: end game
		for (let j = 0; j < cubes[i].length; j++) {
			if (cubes[i][j].player == PLAYER1) {
				streak1++;
				streak2 = 0;
			} else if (cubes[i][j].player == PLAYER2) {
				streak2++;
				streak1 = 0;
			}
			if (streak1 == 4) {
				endGame(PLAYER1);
				return;
			}
			if (streak2 == 4) {
				endGame(PLAYER2);
				return;
			}
		}
	}

	// check horizontal four-in-a-rows
	for (let j = 0; j < maxHeight; j++) {
		// streak for player 1 and 2
		let streak1 = 0;
		let streak2 = 0;

		// if streak of 4 found: end game
		for (let i = 0; i < cubes.length; i++) {
			if (cubes[i][j] && cubes[i][j].player == PLAYER1) {
				streak1++;
				streak2 = 0;
			} else if (cubes[i][j] && cubes[i][j].player == PLAYER2) {
				streak2++;
				streak1 = 0;
			}
			if (streak1 == 4) {
				endGame(PLAYER1);
				return;
			}
			if (streak2 == 4) {
				endGame(PLAYER2);
				return;
			}
		}
	}

	// TODO: check diagonal four-in-a-rows
}

/**
 * Ends the game if a player has four in a row
 *
 * @param   player  int     the player that has won (1 or 2)
 */
function endGame(player) {
	// disable buttons
	const buttons = document.querySelectorAll('#buttons input');
	for (let i = 0; i < buttons.length; i++) buttons[i].disabled = true;

	// show winner
	document.querySelector('#result').innerHTML = 'player ' + player + ' wins';
	document.querySelector('#result').style.display = 'block';
}

// start your engines!
init();
animate();
