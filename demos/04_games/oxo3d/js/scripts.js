/* eslint-disable no-magic-numbers */
/* eslint-disable no-undef */
/**
 * OXO 3D script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@odisee.be>
 * @date 2019-01
 * @version 3.0
 */

/**
 * Variables and constants
 *
 */

// board
const BOARD_INNERSIZE = 240;
const BOARD_LINEWIDTH = 4;
const BOARD_NUM = 3;
const BOARD_OUTERSIZE = 400;
const BOARD_SPOTRADIUS = 20;
const BOARD_THICKNESS = 6;

// variables
let renderer, scene, audioContext;
const balls = [];
const gameFinished = false;
let player = 1;

/**
 * Check the game
 *
 */
function checkGame() {
	// check if a line is complete
	const winningPlayer = getWinningPlayer([0, 1, 2])
		|| getWinningPlayer([3, 4, 5])
		|| getWinningPlayer([6, 7, 8])
		|| getWinningPlayer([0, 3, 6])
		|| getWinningPlayer([1, 4, 7])
		|| getWinningPlayer([2, 5, 8])
		|| getWinningPlayer([0, 4, 8])
		|| getWinningPlayer([2, 4, 6]);

	// winner found
	if (winningPlayer) {
		// show message
		document.getElementById('result').innerHTML = 'player ' + winningPlayer + ' wins';
		document.getElementById('result').classList.add('animate');
	}
}

/**
 * Check if balls are of the same player
 *
 */
function getWinningPlayer(line) {
	// check if all balls exist
	for (let i = 0; i < line.length; i++) {
		if (!balls[line[i]].player) return false;
	}

	// check if all balls are from the same player
	const candidateWinner = balls[line[0]].player;
	for (let i = 1; i < line.length; i++) {
		if (balls[line[i]].player != candidateWinner) return false;
	}

	// ok
	return candidateWinner;
}

/**
 * Draw the scene
 *
 */
function drawScene() {
	// SCENE

	// create scene
	scene = new THREE.Scene();

	// SOUNDS

	// create audio context
	audioContext = new AudioContext();

	// PLAYBOARD

	// add board
	const boardGeometry = new THREE.CubeGeometry(BOARD_OUTERSIZE, BOARD_THICKNESS, BOARD_OUTERSIZE);
	const boardMaterial = new THREE.MeshPhongMaterial({
		color: 0x666666,
		shininess: 15,
		specular: 0x888888,
		map: (new THREE.TextureLoader()).load('img/wood.jpg')
	});
	board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.castShadow = false;
	board.receiveShadow = true;
	board.position.set(0, -BOARD_THICKNESS / 2 - 2, 0);
	scene.add(board);

	// LINES AND DOTS

	// lines properties
	const lineMaterial = new THREE.MeshBasicMaterial({
		color: 0x221100,
		opacity: 0.5,
		side: THREE.DoubleSide,
		transparent: true
	});

	// add horizontal lines
	const lineHor1 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, BOARD_LINEWIDTH),
		lineMaterial
	);
	lineHor1.position.set(0, 0, -BOARD_INNERSIZE / 2);
	lineHor1.rotation.set(Math.PI / 2, 0, 0);
	scene.add(lineHor1);
	const lineHor2 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, BOARD_LINEWIDTH),
		lineMaterial
	);
	lineHor2.position.set(0, 0, BOARD_INNERSIZE / 2);
	lineHor2.rotation.set(Math.PI / 2, 0, 0);
	scene.add(lineHor2);
	const lineHor3 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, BOARD_LINEWIDTH),
		lineMaterial
	);
	lineHor3.rotation.set(Math.PI / 2, 0, 0);
	lineHor3.position.set(0, 0, 0);
	scene.add(lineHor3);

	// add vertical lines
	const lineVert1 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, 4),
		lineMaterial
	);
	lineVert1.position.set(-BOARD_INNERSIZE / 2, 0, 0);
	lineVert1.rotation.set(Math.PI / 2, 0, Math.PI / 2);
	scene.add(lineVert1);
	const lineVert2 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, 4),
		lineMaterial
	);
	lineVert2.position.set(BOARD_INNERSIZE / 2, 0, 0);
	lineVert2.rotation.set(Math.PI / 2, 0, Math.PI / 2);
	scene.add(lineVert2);
	const lineVert3 = new THREE.Mesh(
		new THREE.PlaneGeometry(BOARD_INNERSIZE, 4),
		lineMaterial
	);
	lineVert3.position.set(0, 0, 0);
	lineVert3.rotation.set(Math.PI / 2, 0, Math.PI / 2);
	scene.add(lineVert3);

	// add dots
	const dotMaterial = new THREE.MeshBasicMaterial({
		color: 0x440000,
		opacity: 0.7,
		side: THREE.DoubleSide,
		transparent: true
	});
	for (let i = 0; i < BOARD_NUM * BOARD_NUM; i++) {
		const dot = new THREE.Mesh(
			new THREE.CircleBufferGeometry(BOARD_SPOTRADIUS, 64),
			dotMaterial
		);
		const row = parseInt(i / BOARD_NUM);
		const col = parseInt(i % BOARD_NUM);
		dot.position.set(BOARD_INNERSIZE / 2 * (col - 1), 1, BOARD_INNERSIZE / 2 * (row - 1));
		dot.rotation.set(Math.PI / 2, 0, 0);
		dot.isDot = true;
		dot.nr = i;
		scene.add(dot);
	}

	// add balls
	for (let i = 0; i < BOARD_NUM * BOARD_NUM; i++) {
		// create ball
		const ballTexture = (new THREE.TextureLoader()).load('img/rainbow.jpg');
		const ballMaterial = new THREE.MeshPhongMaterial({
			shininess: 30,
			specular: 0x333333,
			map: ballTexture
		});
		const ballGeometry = new THREE.SphereGeometry(25, 25, 25);
		const ball = new THREE.Mesh(ballGeometry, ballMaterial);
		const row = parseInt(i / BOARD_NUM);
		const col = parseInt(i % BOARD_NUM);
		ball.castShadow = true;
		ball.receiveShadow = false;
		ball.position.set(BOARD_INNERSIZE / 2 * (col - 1), 6, BOARD_INNERSIZE / 2 * (row - 1));
		ball.rotationSpeed = Math.random() / 4 + 0.1;
		ball.scale.set(0.3, 0.3, 0.3);
		ball.visible = false;

		// init ball oscillator
		const oscillator = audioContext.createOscillator();
		oscillator.frequency.value = 200;
		const amp = audioContext.createGain();
		amp.gain.value = 0;
		oscillator.connect(amp);
		amp.connect(audioContext.destination);

		// init ball soundfx
		const pop = new Audio('snd/pop.mp3');

		// attach ball properties
		ball.amp = amp;
		ball.oscillator = oscillator;
		ball.currScale = 0.3;
		ball.animating = false;
		ball.pop = pop;

		// add ball to list and scene
		balls[i] = ball;
		scene.add(ball);
	}

	// LIGHTS

	// add ambient light
	ambientlight = new THREE.AmbientLight(0x444444, 2);
	scene.add(ambientlight);

	// add spotlight 1
	spotlight1 = new THREE.SpotLight(0xFFFFFF, 0.3);
	spotlight1.position.set(75, 400, -75);
	spotlight1.target.position.set(0, 0, 0);
	spotlight1.shadow.camera.visible = true;
	spotlight1.castShadow = true;
	spotlight1.shadow.mapSize.width = 2042;
	spotlight1.shadow.mapSize.height = 2042;
	scene.add(spotlight1);

	// add spotlight 2
	spotlight2 = new THREE.SpotLight(0xFFFFFF, 0.3);
	spotlight2.position.set(-25, 400, -75);
	spotlight2.target.position.set(0, 5, 0);
	spotlight2.shadow.camera.visible = true;
	spotlight2.castShadow = true;
	spotlight2.shadow.mapSize.width = 2042;
	spotlight2.shadow.mapSize.height = 2042;
	scene.add(spotlight2);

	// CAMERA & RENDERER

	// add camera
	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.set(0, 400, 600);
	camera.lookAt(new THREE.Vector3(0, 20, 0));

	// init renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0xdddddd));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// append to the HTML DOM
	document.body.appendChild(renderer.domElement);
}

/**
 * Handle mouse clicks; if a dot was clicked, call handleSpotClick(dot)
 *
 * @see https://stackoverflow.com/questions/7984471/how-to-get-clicked-element-in-three-js
 */
function handleMouseClick(event) {
	// prevent any default
	event.preventDefault();

	// create a ray from the camera to the clicked point
	const raycaster = new THREE.Raycaster();
	const x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
	const y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
	raycaster.setFromCamera({ x, y }, camera);

	// find objects intersected by the ray
	const intersects = raycaster.intersectObjects(scene.children);

	// find the first intersected object that is a dot and handle the click
	for (const intersect of intersects) {
		if (intersect.object.isDot) {
			handleSpotClick(intersect.object.nr);
			return;
		}
	}
}

/**
 * Handle a clicked dot
 *
 */
function handleSpotClick(nr) {
	// get ball
	const ball = balls[nr];

	// ball already played or game finished?
	if (ball.player || gameFinished) return;

	// change ball texture
	ball.material.map = THREE.ImageUtils.loadTexture(player == 1 ? 'img/glass1.jpg' : 'img/glass2.jpg');
	ball.material.needsUpdate = true;

	// show ball
	ball.animating = true;
	ball.visible = true;

	// start ball oscillator
	ball.oscillator.start();

	// remember which player played this ball
	ball.player = player;

	// switch player
	player = player === 1 ? 2 : 1;
}

/**
 * Render the scene
 *
 */
function render() {
	// keep looping
	requestAnimationFrame(render);

	// animate
	for (let i = 0; i < balls.length; i++) {
		const ball = balls[i];
		if (ball.player && ball.animating) {
			// rotate ball
			ball.rotation.y += ball.rotationSpeed;

			// increase sound volume and frequency
			ball.amp.gain.value += 0.01;
			ball.oscillator.frequency.value += 30;
			if (ball.oscillator.frequency.value > 1000) ball.amp.gain.value = 0;

			// rescale ball
			if (ball.currScale < 1) {
				ball.currScale += 0.02;
				ball.scale.set(ball.currScale, ball.currScale, ball.currScale);
			}

			// ball has reached full size
			if (ball.currScale >= 1) {
				ball.animating = false;
				ball.pop.play();
				ball.amp.gain.value = 0;
				checkGame();
			}
		}
	}

	// render the scene
	renderer.render(scene, camera);
}

/**
 * Launch the game
 *
 */
function launchGame() {
	// draw the scene
	drawScene();

	// start rendering
	render();

	// wait for mouse clicks
	document.addEventListener('click', handleMouseClick, false);
}

/**
 * Start your engines!
 *
 */

launchGame();
