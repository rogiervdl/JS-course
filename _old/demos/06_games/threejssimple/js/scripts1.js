/**
 * OXO 3D script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@kahosl.be>
 */

// init scene
var scene = new THREE.Scene();

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
var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
shape.position.y = 70;
shape.rotation.y = Math.PI / 360 * 120;
scene.add( shape );

// add camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 250;
camera.position.z = 250;
camera.lookAt(new THREE.Vector3(0, 50, 0));

// init renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// render the scene
renderer.render(scene, camera);       
