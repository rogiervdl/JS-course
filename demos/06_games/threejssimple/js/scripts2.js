/**
 * OXO 3D script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@kahosl.be>
 */

// init scene
scene = new THREE.Scene();

// add ground
var groundGeometry = new THREE.PlaneGeometry( 200, 300, 32 );
var groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x666666,
    side: THREE.DoubleSide
});
var ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = Math.PI / 360 * 110;
scene.add( ground );

// add torus
var shapeGeometry = new THREE.TorusGeometry(30, 10, 12, 24);
var shapeMaterial = new THREE.MeshPhongMaterial({
    color: 0x156289
});
shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
shape.position.y = 70;
shape.rotation.y = Math.PI / 360 * 120;
scene.add( shape );

// add ambient light
var ambientlight = new THREE.AmbientLight(0x444444, 2.5);
scene.add(ambientlight);

// add spotlight
var spotlight = new THREE.SpotLight(0xFFFFFF, 0.7);
spotlight.position.set(150, 200, -75);
spotlight.penumbra = 0.1;
spotlight.angle = 0.4;
scene.add(spotlight);

// add camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 250;
camera.position.z = 250;
camera.lookAt(new THREE.Vector3(0, 50, 0));

// init renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000));
document.body.appendChild(renderer.domElement);

// render the scene
renderer.render(scene, camera);       
