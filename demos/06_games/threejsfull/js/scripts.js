/**
 * OXO 3D script
 *
 * @author Rogier van der Linde <rogier.vanderlinde@kahosl.be>
 */

// shortcut 
var $ = function(id) {
    return document.getElementById(id);
}

// general
var camera1, scene, renderer;

// lights
var ambientlight, directlight1, spotlight1;

// objects
var size = 25;
var ground, shape;

// materials
var shapeMaterialPhong, shapeMaterialPhongSmooth, shapeMaterialPhongTexture, shapeMaterialPhongTextureSmooth;
var shapeMaterialLambert, shapeMaterialBasic, shapeMaterialWire;
var shapeGeometry;

/**
 * Initializes the game
 *
 */
var init = function() {
    // init scene
    scene = new THREE.Scene();

    // add ground
    var groundGeometry = new THREE.CubeGeometry( 300, 6, 200);
    groundMaterialPhong = new THREE.MeshPhongMaterial({
        color: 0x666666,
        shininess: 15, 
        specular: 0x888888,
        shading: THREE.SmoothShading
    });
    ground = new THREE.Mesh(groundGeometry, groundMaterialPhong);
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add(ground);

    // add ambient light
    ambientlight = new THREE.AmbientLight(0x444444, 1.5);
    scene.add(ambientlight);

    // add directional light
    directlight1 = new THREE.DirectionalLight( 0x555555, 1 );
    directlight1.position.set( -30, 130, -30 );
    directlight1.castShadow = true;
    directlight1.shadow.camera.near = -100;
    directlight1.shadow.camera.far = 200;
    directlight1.shadow.camera.right = 100;
    directlight1.shadow.camera.left = - 100;
    directlight1.shadow.camera.top  = 100;
    directlight1.shadow.camera.bottom = - 100;
    directlight1.shadow.mapSize.width = 1024;
    directlight1.shadow.mapSize.height = 1024;
    scene.add(new THREE.CameraHelper(directlight1.shadow.camera));
    scene.add( directlight1 );

    // add spotlight
    spotlight1 = new THREE.SpotLight(0xFFFFFF, 0.3);
    spotlight1.position.set(75, 100, -75);
    spotlight1.shadow.camera.visible = true;            
    spotlight1.castShadow = true;
    spotlight1.shadow.mapSize.width = 2042;
    spotlight1.shadow.mapSize.height = 2042;
    spotlight1.penumbra = 0.1;
    spotlight1.angle = 0.7;
    scene.add(new THREE.CameraHelper(spotlight1.shadow.camera));
    scene.add(spotlight1);

    // add camera
    camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera1.position.x = 0;
    camera1.position.y = 250;
    camera1.position.z = 250;
    camera1.lookAt(new THREE.Vector3(0, 50, 0));

    // add shape
    shapeGeometry = new THREE.TorusGeometry(30, 10, 12, 24);
    shapeMaterialWire = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
    shapeMaterialBasic = new THREE.MeshBasicMaterial({color: 0x156289 });
    shapeMaterialLambert = new THREE.MeshLambertMaterial({color: 0x156289});
    shapeMaterialPhong = new THREE.MeshPhongMaterial({
        color: 0x156289,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading, 
        shininess: 60, 
        specular: 0x156289,
    });
    shapeMaterialPhongSmooth = new THREE.MeshPhongMaterial({
        color: 0x156289,
        side: THREE.DoubleSide,
        shading: THREE.SmoothShading, 
        shininess: 60, 
        specular: 0x156289,
    });
    var shapeTexture = (new THREE.TextureLoader()).load('img/glass1.jpg');
    shapeMaterialPhongTexture = new THREE.MeshPhongMaterial({
        color: 0xCCCCCC,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading, 
        shininess: 60, 
        specular: 0x156289,
        map: shapeTexture
    });
    shapeMaterialPhongTextureSmooth = new THREE.MeshPhongMaterial({
        color: 0xCCCCCC,
        side: THREE.DoubleSide,
        shading: THREE.SmoothShading, 
        shininess: 60, 
        specular: 0x000000,
        map: shapeTexture
    });
    shape = new THREE.Mesh(shapeGeometry, shapeMaterialPhong);
    shape.castShadow = true;
    shape.receiveShadow = false;
    shape.position.y = 60;
//    shape.eulerOrder = 'XYZ';
    scene.add(shape);

    // ambient light events
    chbAmbient.addEventListener('click', function() {
        ambientlight.intensity = this.checked ? inpAmbientIntensity.value : 0;
    });
    inpAmbientIntensity.addEventListener('input', function() {
        ambientlight.intensity = this.value;
    });
    inpAmbientColor.addEventListener('input', function() {
        ambientlight.color.setHex('0x' + this.value.substring(1).toUpperCase());
    });

    // direct light events
    chbDirect.addEventListener('click', function() {
        directlight1.intensity = this.checked ? inpDirectIntensity.value : 0;
    });
    inpDirectIntensity.addEventListener('input', function() {
        directlight1.intensity = this.value;
    });
    inpDirectColor.addEventListener('input', function() {
        directlight1.color.setHex('0x'+ this.value.substring(1).toUpperCase());
    });
    inpDirectX.addEventListener('input', function() {
        directlight1.position.x = this.value;
    });
    inpDirectY.addEventListener('input', function() {
        directlight1.position.y = this.value;
    });
    inpDirectZ.addEventListener('input', function() {
        directlight1.position.z = this.value;
    });

    // spotlight events
    chbSpot.addEventListener('click', function() {
        spotlight1.intensity = this.checked ? inpSpotIntensity.value : 0;
    });
    inpSpotIntensity.addEventListener('input', function() {
        spotlight1.intensity = this.value;
    });
    inpSpotColor.addEventListener('input', function() {
        spotlight1.color.setHex('0x' + this.value.substring(1).toUpperCase());
    });
    inpSpotX.addEventListener('input', function() {
        spotlight1.position.x = this.value;
    });
    inpSpotY.addEventListener('input', function() {
        spotlight1.position.y = this.value;
    });
    inpSpotZ.addEventListener('input', function() {
        spotlight1.position.z = this.value;
    });
    inpSpotAngle.addEventListener('input', function() {
        spotlight1.angle = this.value;
    });

    // camera events
    var applyCameraValues = function() {
        camera1.lookAt(new THREE.Vector3(cameraLookatX.value, cameraLookatY.value, cameraLookatZ.value));
        camera1.position.set(cameraPosX.value, cameraPosY.value, cameraPosZ.value);
    }
    cameraLookatX.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraLookatY.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraLookatZ.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraPosX.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraPosY.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraPosZ.addEventListener('input', function() {
        applyCameraValues();
    });
    cameraReset.addEventListener('click', function(e) {
        cameraLookatX.value = 0;
        cameraLookatY.value = 50;
        cameraLookatZ.value = 0;
        cameraPosX.value = 0;
        cameraPosY.value = 250;
        cameraPosZ.value = 250;
        applyCameraValues();
        applyCameraValues(); // apply twice (threejs bug)
        e.stopPropagation();
        e.preventDefault();
    });

    // shape controls events
    var applyShapeMaterial = function() {
        if (rbnMaterialWire.checked) {
            shape.material = shapeMaterialWire;
        }
        if (rbnMaterialBasic.checked) {
            shape.material = shapeMaterialBasic;
        }
        if (rbnMaterialLambert.checked) {
            shape.material = shapeMaterialLambert;
        }
        if (rbnMaterialPhong.checked) {
            if (selTexture.value == -1) {
                shape.material = rbnShadingFlat.checked ? shapeMaterialPhong : shapeMaterialPhongSmooth;
                shape.material.color.setHex('0x' + inpColor.value.substring(1).toUpperCase());
                shape.material.specular.setHex('0x' + inpColor.value.substring(1).toUpperCase());
            } else {
                shape.material = rbnShadingFlat.checked ? shapeMaterialPhongTexture : shapeMaterialPhongTextureSmooth;
                var newTexture = (new THREE.TextureLoader()).load('img/' + selTexture.value) 
                newTexture.wrapS = THREE.RepeatWrapping;
                newTexture.wrapT = THREE.RepeatWrapping;
                newTexture.repeat.set( 4, 2 );
                shape.material.map = newTexture;
                shape.material.color.setHex('0xFFFFFF');
                shape.material.specular.setHex('0xFFFFFF');
            }
            shape.material.shininess = inpShininess.value;
        }
    }
    rbnMaterialWire.addEventListener('click', function() {
        applyShapeMaterial();
    });
    rbnMaterialBasic.addEventListener('click', function() {
        applyShapeMaterial();
    });
    rbnMaterialLambert.addEventListener('click', function() {
        applyShapeMaterial();
    });
    rbnMaterialPhong.addEventListener('click', function() {
        applyShapeMaterial();
    });
    inpColor.addEventListener('input', function() {
        applyShapeMaterial();
    });
    rbnShadingFlat.addEventListener('click', function() {
        applyShapeMaterial();
    });
    rbnShadingSmooth.addEventListener('click', function() {
        applyShapeMaterial();
    });
    inpShininess.addEventListener('input', function() {
        applyShapeMaterial();
    });
    selTexture.addEventListener('input', function() {
        applyShapeMaterial();
    });
    inpPosX.addEventListener('input', function() {
        shape.position.x = this.value;
    });
    inpPosY.addEventListener('input', function() {
        shape.position.y = this.value;
    });
    inpPosZ.addEventListener('input', function() {
        shape.position.z = this.value;
    });
    inpRotX.addEventListener('input', function() {
        shape.rotation.x = this.value;
    });
    inpRotY.addEventListener('input', function() {
        shape.rotation.y = this.value;
    });
    inpRotZ.addEventListener('input', function() {
        shape.rotation.z = this.value;
    });

    // init renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
}

/**
 * Renders the scene
 *
 */
var render = function() {
    // keep looping
    requestAnimationFrame(render);

    // animate?
    if (chbAnimate.checked) {
        shape.rotation.y += 0.01;
    }

    // render the scene
    renderer.render(scene, camera1);       
}

// init the scene
init();

// render the scene
render();
