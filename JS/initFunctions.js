//Globalne spremenljivke ter definicije funkcij za inizializacijo

var canvas;
var gl;
var shaderProgram;

var fullScreen= false;
var cameraHeigth= 0;

// Buffers
var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;
var worldVertexNormalBuffer= null;

// Matrike
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var lightMatrix = mat4.create();

// Teksture
var grassTexture;
var floorTexture;
var brickTexture;
var wallTexture;

// Variable that stores  loading state of textures.
var texturesLoaded = false;

// Tipkovnica
var currentlyPressedKeys = {};

//Miska
var lastMouseX= null;
var lastMouseY= null;
var normalMouse=true;
var mouseEvent=null;

// Lokacija in hitrost
var pitch = 0;
var pitchRate = 0;
var yaw = 200;
var yawRate = 0;
var xPosition = 1;
var yPosition = 0.4;
var zPosition = 1;
var speed = 0;
var strafingSpeed= 0;
var gravity = 0.098;

var joggingAngle = 0;

//Animacija
var lastTime = 0;

//Funkcije za delo s skladom
function mvPushMatrix()
{
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix()
{
	if (mvMatrixStack.length == 0) throw "Invalid popMatrix!";
	mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees)
{
	return degrees * Math.PI / 180;
}

function initGL(canvas)
{
  var gl = null;
  try
  {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {}
  
  if (!gl) alert("Unable to initialize WebGL. Your browser may not support it.");
  return gl;
}

function goFullScreen()
{
	canvas.style.width= screen.width;
	canvas.style.heigth= screen.height;
	
	//Zahtevaj celotni zaslon
	if (canvas.requestFullscreen) canvas.requestFullscreen();
	else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
	else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
	else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
	else
	{
		alert("Napaka! Ne morem v celozaslonski nacin!");
		return false;
	}
	//Registreiraj dogodek za izhod iz celefa zaslona -> disableDullScreen
	document.addEventListener('fullscreenchange', disableFullScreen, false);
	document.addEventListener('mozfullscreenchange', disableFullScreen, false);
	document.addEventListener('webkitfullscreenchange', disableFullScreen, false);
	
	return true;
}

//Izvede ob izhodu iz celega zaslona
function disableFullScreen()
{
	fullScreen= !fullScreen;
	if (!fullScreen) location.reload();
}

function start()
{
	canvas = document.getElementById("glcanvas");
	canvas.removeEventListener("click", start);
	
	var fsI= goFullScreen();
	var moI= initMouse();
	
	if(!fsI || !moI)
	{
		console.log("Napaka pri zagonu igre! Izhod...");
		return;
	}
	
	gl = initGL(canvas);

	if (gl)
	{
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		initShaders();
		initTextures();
		loadWorld();
		
		//Tipkovnica
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

		// Zanka
		setInterval(function() {
			if (texturesLoaded)
			{
				requestAnimationFrame(animate);
				handleKeys();
				premakni();
				drawScene();
			}
		}, 15);
	}
}
