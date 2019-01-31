/**
 * OXO 3D script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@kahosl.be>
 */

// init scene
var scene = new THREE.Scene();

// add ground
var groundGeometry = new THREE.PlaneGeometry( 200, 300, 32 );
var groundTexture = (new THREE.TextureLoader()).load('img/floor.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 4, 4 );
var groundMaterial = new THREE.MeshPhongMaterial({
    shininess: 15, 
    specular: 0x888888,
    shading: THREE.SmoothShading, 
    side: THREE.DoubleSide,
    map: groundTexture
});
var ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = Math.PI / 360 * 110;
ground.castShadow = false;
ground.receiveShadow = true;
scene.add( ground );

// add shape
var shapeGeometry = new THREE.TorusGeometry(30, 10, 12, 24);
var shapeMaterial = new THREE.MeshPhongMaterial({
    color: 0x156289,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading, 
    shininess: 60, 
    specular: 0x156289
});
var shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
shape.castShadow = true;
shape.receiveShadow = false;
shape.position.y = 70;
shape.rotation.y = Math.PI / 360 * 120;
scene.add( shape );

// add ambient light
var ambientlight = new THREE.AmbientLight(0x444444, 2.5);
scene.add(ambientlight);

// add spotlight
var spotlight = new THREE.SpotLight(0xFFFFFF, 0.7);
spotlight.position.set(150, 200, -75);
spotlight.shadow.camera.visible = true;            
spotlight.castShadow = true;
spotlight.penumbra = 0.1;
spotlight.angle = 0.4;
scene.add(spotlight);

// add camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 250;
camera.position.z = 250;
camera.lookAt(new THREE.Vector3(0, 50, 0));

// init renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// render
var render = function() {
    // keep looping
    requestAnimationFrame(render);
    shape.rotation.y += 0.03;

    // render the scene
    renderer.render(scene, camera);       
}
render();
