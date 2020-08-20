/*
    WebGL First Person Scene
    Jacky Tea

    A first person movement and rendering 
    demonstration with lighting and shadows.
*/

//environment elements
var scene = null;
var camera = null;
var renderer = null
var floor = null;
var ambientLight = null;
var pointLight = null;
var keyboard = {};
var controller = {};
var projectiles = [];
var wireFrameEnabled = false;
var block1, block2, block3, block4;
var model = null;

//event listeners
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.onload = init;
window.onresize = function() {
    if(renderer !== null) {
        setRenderer(window.innerWidth - 2, window.innerHeight - 2.5);
    }
}

//polygon structure for models in the scene
function createMesh(geometry, material) {
    return new THREE.Mesh(geometry, material);
}

//setup of what is to be rendered
function createScene() {
    return new THREE.Scene();
}

//class responsible for placing elements in the scene
function createRenderer() {
    return new THREE.WebGLRenderer();
}

//set the lense of the camera and what it see
function createCamera(fieldOfView, aspectRatioWidth, aspectRatioHeight, nearValue, farValue) {
    return new THREE.PerspectiveCamera(fieldOfView, aspectRatioWidth / aspectRatioHeight, nearValue, farValue);
}

//camera position to the user
function setCamera(x1, y1, z1, x2, y2, z2) {
    camera.position.set(x1, y1, z1);
    camera.lookAt(new THREE.Vector3(x2, y2, z2));
}

//attributes of the user
function setController(height, speed, turnSpeed) {
    controller.height = height;
    controller.speed = speed;
    controller.turnSpeed = turnSpeed;
    controller.canShoot = 0;
}

//size of the window (display based)
function setRenderer(width, height) {
    renderer.setSize(width, height);
}

//set the skybox colour
function setSceneColour(colour) {
    scene.background = new THREE.Color(colour);
}

//add a global light to the stage
function addAmbientLight(colour, intensity) {
    ambientLight = new THREE.AmbientLight(colour, intensity);
    scene.add(ambientLight);
}

//add a central point of illumination
function addPointLight(colour, intensity, distance, x, y, z, cast, near, far) {
    pointLight = new THREE.PointLight(colour, intensity, distance);
    pointLight.position.set(x, y, z);
    pointLight.castShadow = cast;
    pointLight.shadow.camera.near = near;
    pointLight.shadow.camera.far = far;
    scene.add(pointLight);
}

//add shadows to a mesh model
function addShadows(mesh, cast, receive) {
    if (cast) { mesh.castShadow = cast; }
    if (receive) { mesh.receiveShadow = receive }
}

//add a flat plane to the scene
function addFloor(width, height, details, color, wireFrameEnabled) {
    var floorGeometry = new THREE.PlaneGeometry(width, height, details, details);
    var floorMaterial = new THREE.MeshPhongMaterial({ color: color, wireframe: wireFrameEnabled });
    floor = createMesh(floorGeometry, floorMaterial);
    floor.rotation.x -= Math.PI / 2;
    scene.add(floor);
}

//add a block to the scene
function addBlock(width, height, depth, colour, x, y, z, cast, receive) {
    var blockGeometry = new THREE.BoxGeometry(width, height, depth);
    var blockMaterial = new THREE.MeshPhongMaterial({ color: colour, wireframe: wireFrameEnabled });
    var block = createMesh(blockGeometry, blockMaterial);
    block.position.set(x, y, z);
    addShadows(block, cast, receive);
    scene.add(block);
    return block;
}

//cast shadows on the global stage
function enableShadows() {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
}

//load the assets of the model to render it
function loadModel(filePathMTL, filePathOBJ) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(filePathMTL, function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(filePathOBJ, function (mesh) {
            mesh.scale.set(10, 10, 10);
            model = mesh;
            scene.add(mesh);
        })
    });
    return model;
}

//lock the model to the user's perspective
function lockFirstPersonView(model) {
    var time = Date.now() * 0.0005;
    model.position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
        camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75
    );
    model.rotation.set(
        camera.rotation.x,
        camera.rotation.y - Math.PI,
        camera.rotation.z
    );
}

//launch projectiles in appropriate direction
function launchProjectiles() {
    for (var i = 0; i < projectiles.length; i++) {
        if (projectiles[i] == undefined) {
            continue;
        }
        if (projectiles[i].alive == false) {
            projectiles.splice(i, 1);
            continue;
        }
        projectiles[i].position.add(projectiles[i].velocity);
    }
}

//animate spinning blocks
function animateBlock(block) {
    block.rotation.x += 0.01;
    block.rotation.y += 0.01;
}

//keyboard events
function keyListeners() {
    // W key to move forwards
    if (keyboard[87]) {
        camera.position.x -= Math.sin(camera.rotation.y) * controller.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * controller.speed;
    }
    // S key to move forwards
    if (keyboard[83]) {
        camera.position.x += Math.sin(camera.rotation.y) * controller.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * controller.speed;
    }
    // A key to move left
    if (keyboard[65]) {
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * controller.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * controller.speed;
    }
    // D key to move right
    if (keyboard[68]) {
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * controller.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * controller.speed;
    }
    // left arrow key to turn camera left 
    if (keyboard[37]) {
        camera.rotation.y -= controller.turnSpeed;
    }
    // right arrow key to turn camera right
    if (keyboard[39]) {
        camera.rotation.y += controller.turnSpeed;
    }
    // space bar key to shoot projectile
    if (keyboard[32]) {
        var projectile = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        projectile.position.set(
            model.position.x,
            model.position.y + 0.07,
            model.position.z
        );
        projectile.velocity = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );
        projectile.alive = true;
        setTimeout(function () {
            projectile.alive = false;
            scene.remove(projectile);
        }, 1000);
        projectiles.push(projectile);
        scene.add(projectile);
        controller.canShoot = 10;
    }
    if (controller.canShoot > 0) {
        controller.canShoot -= 1;
    }
}

//a key is held down
function keyDown(event) {
    keyboard[event.keyCode] = true;
}

//a key is released
function keyUp(event) {
    keyboard[event.keyCode] = false;
}

//initialize and setup scene elements
function init() {
    //player controls
    setController(2.0, 0.2, Math.PI * 0.02);

    //scene and camera
    scene = createScene();
    setSceneColour(0x94bdff);
    camera = createCamera(90, window.innerWidth, window.innerHeight, 0.1, 25);
    setCamera(0, controller.height, -5, 0, controller.height, 0);

    //add meshes
    addFloor(100, 100, 10, 0xffffff, wireFrameEnabled);
    block1 = addBlock(3, 3, 3, 0xff0000, 8.5, 3, 8.5, true, true);
    block2 = addBlock(3, 3, 3, 0x00ff00, 8.5, 3, -8.5, true, true);
    block3 = addBlock(3, 3, 3, 0x0000ff, -8.5, 3, -8.5, true, true);
    block4 = addBlock(3, 3, 3, 0xffff00, -8.5, 3, 8.5, true, true);
    loadModel("../models/sShort.mtl", "../models/sShort.obj");


    //add lighting and shadows
    addAmbientLight(0xffffff, 0.2);
    addPointLight(0xffffff, 0.8, 18, -3, 6, -3, true, 0.1, 25);
    addShadows(floor, false, true);

    //renderer setup
    renderer = createRenderer();
    setRenderer(window.innerWidth - 2, window.innerHeight - 2.5);
    enableShadows();

    //add to DOM and animate
    document.body.appendChild(renderer.domElement);
    animate();
}

//continuously check and render the scene
function animate() {
    //animate the scene
    requestAnimationFrame(animate);

    //animate elements
    animateBlock(block1);
    animateBlock(block2);
    animateBlock(block3);
    animateBlock(block4);

    //handle events
    keyListeners();

    //launch projectiles
    launchProjectiles();

    //put model in first person
    lockFirstPersonView(model);

    //show scene and camera
    renderer.render(scene, camera);
}