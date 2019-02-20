var canvas3d = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas3d, true); // Generate the BABYLON 3D engine

let xCorrection = -1;
let yCorrection = -1;

var polygons = [];
var rotations = [];

//class declaration for pixel objects
class Pixel {
    constructor(luma, posX, posY) {
      this.luma = luma;
      this.posX = posX;
      this.posY = posY;
    }
}

const canvas = document.getElementById("mainCanvas");

const imageWrapper = document.getElementById("imgWrapper");
const image1 = document.getElementById("img1");

let invertFlag = true;
const context = canvas.getContext("2d");
let image = null;
let width = null;
let height = null;
let interval = 5;
let minLuma = 160;
let lastPixel = 0;
let speed = 0;
let pixelList = new Array(); //main array with image/pixel information
let last = 0; //last timestamp
let visibleDots = 0;
let animationDoneFlag = true;
let pathsCount = 0;
let maxPaths = 200;
let maxCircleSize = 8;
let randomColorFlag = true;
let randomColor = Math.round(Math.random()*360);


//compare function for luma property in pixel-object array (max value on first position)
function compare(a,b) {
    if (a.luma < b.luma)
    return 1;
    if (a.luma > b.luma)
    return -1;
    return 0;
}

//inspect the loaded pictures pixels and start the drawing process
function drawArt() {
    //inspect picture
    for(let y=0; y<canvas.height; y+=interval) {
        for(let x=0; x<canvas.width; x+=interval) {
            //get single pixel from picture 
            let pixel = context.getImageData(x,y,1,1);
            //calculate brightness/lumnance from rgb data of pixel following the ITU-R BT.709 standard
            let luma = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1]  + 0.0722 * pixel.data[2]; // per ITU-R BT.709

            //create new pixel oblect and save it into the array
            let tmpPixel = new Pixel(luma,x,y);
            pixelList.push(tmpPixel);
        }
    }

    //sort array by luma property
    pixelList.sort(compare);

    xCorrection = Math.round(canvas.width/2);
    yCorrection = Math.round(canvas.height/2);

    if (invertFlag) {
        lastPixel = pixelList.length - 1;
    }

    //start drawing animation
    animationDoneFlag = false;
}


function redraw() {
    //clear canvas elements
    context.clearRect(0, 0, canvas.width, canvas.height);
   
    image = image1;
    image.crossOrigin = "Anonymous";


    //calculate height & width for canvas and image container
    width = image.clientWidth;
    height = image.clientHeight;
    width = width/(height/500);
    height = 500;

    if (height > document.documentElement.clientHeight) {
        width = width/(height/document.documentElement.clientHeight);
        height = document.documentElement.clientHeight;
    }

    //set height & width and position of canvas image
    canvas.width = width;
    canvas.height = height;

    image.style.width = width+"px";
    image.style.height = height+"px";

    imageWrapper.style.width = 0+"px";
    imageWrapper.style.height = height+"px";

    //caclulate with to center elements
    positionCanvas = document.documentElement.clientWidth/2 - width/2;
    canvas.style.left = Math.round(positionCanvas) + "px";
    imageWrapper.style.left = Math.round(positionCanvas) + "px";

    //draw image in not visible canvas for later image data inspection
    context.drawImage(image,0,0,canvas.width,canvas.height);

    //reset variabels
    lastPixel = 0;
    pixelList = new Array();
    last = 0;
    visibleDots = 0;
    animationDoneFlag = true;
    pathsCount = 0;
    maxPaths = 80;
    randomColor = Math.random();
}




var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    /*

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    */

   var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
   camera.attachControl(canvas, true);

   
   // Add lights to the scene
   var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
   var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

	// use jQuery (or normal javascript) to add 
    // an on click event binding to the button
    /*
	$('#button').click(function () {
		// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
		//var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		// Move the sphere upward 1/2 its height
        //sphere.position.y = 1;
        

        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
        sphere.position.y = Math.round(Math.random()*100);
        sphere.position.x = Math.round(Math.random()*100);
    });
    */

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
   // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
   //var box1 = BABYLON.Mesh.CreateBox("Box1", 10.0, scene);
   

   /*
    var mat = new BABYLON.StandardMaterial("mat1", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);

    

    var rot = (0.5 - Math.random()) / 8;
    */



   scene.registerBeforeRender(function () {
        //polygon.rotation.y += rot;
        //polygon.rotation.x += rot / 4;


        for (var p = 0; p < polygons.length; p++) {
            polygons[p].rotation.y += rotations[p];
            polygons[p].rotation.x += rotations[p] / 4;
        }
    });






    return scene;

};


var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
    //console.log(animationDoneFlag);

    for (var i = 0; i < 5; i++) {
        if (!animationDoneFlag) {
            if (lastPixel < pixelList.length && lastPixel >= 0) {
               // console.log("daaa");
                //check if pixels brightness is within the tolerance of pixel that should be drawn
                if ((pixelList[lastPixel].luma > minLuma && !invertFlag) || (pixelList[lastPixel].luma < minLuma && invertFlag)) {
                    
    
                    let hlsColor = pixelList[lastPixel].luma/255;
                    var r, g, b, h, s, l;
                    h = randomColor;
                    s = 1;
                    l = hlsColor*0.8;
                    console.log("h:" + h + " s:" + s + " l:" + l );
    
    
                    if(s == 0){
                        r = g = b = l; // achromatic
                    }else{
                        var hue2rgb = function hue2rgb(p, q, t){
                            if(t < 0) t += 1;
                            if(t > 1) t -= 1;
                            if(t < 1/6) return p + (q - p) * 6 * t;
                            if(t < 1/2) return q;
                            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                            return p;
                        }
                
                        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                        var p = 2 * l - q;
                        r = hue2rgb(p, q, h + 1/3);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1/3);
                    }
                    console.log("r:" + r + " g:" + g + " b:" + b );
        
    
                    //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:Math.random()*maxCircleSize*2}, scene);
                    
                    var sphere = BABYLON.MeshBuilder.CreatePolyhedron("oct", {type: Math.round(Math.random()*15), size: 3}, scene);
                    sphere.convertToFlatShadedMesh();
                    //polygon.material = mat;
                    
                    sphere.position.y = (pixelList[lastPixel].posY - yCorrection)*-1;
                    sphere.position.x = pixelList[lastPixel].posX - xCorrection;
                    sphere.position.z = hlsColor*70;
    
                    /*
                    var material = new BABYLON.StandardMaterial(scene);
                    material.alpha = 1;
                    material.diffuseColor = new BABYLON.Color3(r, g, b);
                    sphere.material = material;
    
                    */
    
                    var greenMat = new BABYLON.StandardMaterial("greenMat", scene);
                    greenMat.diffuseColor = new BABYLON.Color3(r, g, b);
                    greenMat.alpha = 0.5;	
                    sphere.material = greenMat;
    
                    polygons.push(sphere);
                    rotations.push((0.5 - Math.random()) / 8);
    
                    visibleDots++;
                } 
                else {
                    //all pixels are drawn
                    //animationDoneFlag = true;
                    
                    //calculate number of paths to draw between the pixels
                    if (visibleDots > 0) {
                        maxPaths = Math.round(visibleDots/30);
                    }
                    else {
                        maxPaths = 0;
                    }
                    
                    if (pathsCount < maxPaths) {
                        startPathDrawing();
                    }
                    else {
                        animationDoneFlag = true;
                    }
                   
    
                }
    
                //go to the next pixel
                if (invertFlag) {
                    lastPixel--;
                }
                else {
                    lastPixel++;
                }
            }
        }
    }

    
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
        engine.resize();
});



function startPathDrawing() {
    pathsCount++;

    //if no dots awailable, return
    if (visibleDots < 1) {
        maxPaths = 0;
        return;
    }

    //draw line from random dot, to another random dot
    let randomStart = Math.round(Math.random()*(visibleDots-1));
    let randomEnd = Math.round(Math.random()*(visibleDots-1));

    //for inverted mode, visible dots are on the end of the array
    if (invertFlag) {
        randomStart = pixelList.length - 1 - Math.round(Math.random()*(visibleDots-1));
        randomEnd = pixelList.length - 1 - Math.round(Math.random()*(visibleDots-1));
    }

    //coordinates for drawn lines
    let dot1X = pixelList[randomStart].posX-xCorrection;
    let dot2X = pixelList[randomEnd].posX-xCorrection;
    let dot1Y = (pixelList[randomStart].posY-yCorrection)*-1;
    let dot2Y = (pixelList[randomEnd].posY-yCorrection)*-1;
    let dot1Z = hlsColor = pixelList[randomStart].luma/255*70;
    let dot2Z = hlsColor = pixelList[randomEnd].luma/255*70;

    //Array of points to construct lines
	var myPoints = [
		new BABYLON.Vector3(dot1X, dot1Y, dot1Z),
		new BABYLON.Vector3(dot2X, dot2Y, dot2Z)
	];
	
	//Create lines 
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene); 
    lines.color = new BABYLON.Color3(0, 0, 0);
    lines.alpha = 0.1;

}




redraw();
drawArt();


