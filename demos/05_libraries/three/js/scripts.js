(function() {
	var camera, scene, renderer;

	var init = function() {
		// variables
		var container = document.getElementById('container');

		// create scene
		scene = new THREE.Scene();

		// create camera
		camera = new THREE.OrthographicCamera(
			window.innerWidth / -2, 
			window.innerWidth / 2, 
			window.innerHeight / 2, 
			window.innerHeight / -2, 
			-2000, 
			1000
		);
		camera.position.x = 200;
		camera.position.y = 100;
		camera.position.z = 200;

		// create grid
		var size = 500, step = 50;
		var geometry = new THREE.Geometry();
		for (var i = -size; i <= size; i += step) {
			geometry.vertices.push(new THREE.Vector3(-size, 0, i));
			geometry.vertices.push(new THREE.Vector3(size, 0, i));
			geometry.vertices.push(new THREE.Vector3(i, 0, -size));
			geometry.vertices.push(new THREE.Vector3(i, 0, size));
		}
		var material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 });
		var line = new THREE.Line(geometry, material);
		line.type = THREE.LinePieces;
		scene.add(line);

		// add cubes
		var geometry = new THREE.CubeGeometry(50, 50, 50);
		var material = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, overdraw: true });
		for (var i = 0; i < 100; i++) {
			var cube = new THREE.Mesh(geometry, material);
			cube.scale.y = Math.floor(Math.random() * 2 + 1);
			cube.position.x = Math.floor((Math.random() * 1000 - 500) / 50) * 50 + 25;
			cube.position.y = (cube.scale.y * 50) / 2;
			cube.position.z = Math.floor((Math.random() * 1000 - 500) / 50) * 50 + 25;
			scene.add(cube);
		}

		// add ambient light
		var ambientLight = new THREE.AmbientLight(0x05);
		scene.add(ambientLight);

		// add directional light
		var directionalLight = new THREE.DirectionalLight(0x00ffcc);
		directionalLight.position.x = -0.8;
		directionalLight.position.y = 0.3;
		directionalLight.position.z = 0.5;
		scene.add(directionalLight);

		// create canvas
		renderer = new THREE.CanvasRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);

		// add canvas to container
		container.appendChild(renderer.domElement);

		// events
		window.addEventListener('resize', onWindowResize, false);
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function onWindowResize() {
		console.log('ok');
		camera.left = window.innerWidth / - 2;
		camera.right = window.innerWidth / 2;
		camera.top = window.innerHeight / 2;
		camera.bottom = window.innerHeight / - 2;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function render() {
		var timer = Date.now() * 0.0001;
		camera.position.x = Math.cos(timer) * 200;
		camera.position.z = Math.sin(timer) * 200;
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
	}

	// start your engines
	init();
	animate();

})(); 
