/******* Add the create scene function ******/
/*
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
    var box1 = BABYLON.Mesh.CreateBox("Box1", 10.0, scene);
    box1.position.y = -2;
    sphere.position.y = 2;
    sphere2.position.y = 2;
    sphere2.position.x = 2;

    var animationBox = new BABYLON.Animation("myAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // An array with all animation keys
    var keys = []; 

    //At the animation key 0, the value of scaling is "1"
    keys.push({
        frame: 0,
        value: 1
    });

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
        frame: 20,
        value: 0.2
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
        frame: 100,
        value: 1
    });

    animationBox.setKeys(keys);

    box1.animations = [];
    box1.animations.push(animationBox);

    scene.beginAnimation(box1, 0, 100, true);

    return scene;
};
*/
/******* End of the create scene function ******/  