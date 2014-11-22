//Globalne spremenljivke ter definicije funkcij za inizializacijo

var canvas;
var gl;
var shaderProgram;

// Buffers
var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;

// Matrike
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Teksture
var wallTexture;

// Variable that stores  loading state of textures.
var texturesLoaded = false;

// Tipkovnica
var currentlyPressedKeys = {};

// Lokacija in hitrost
var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPosition = 0;
var yPosition = 0.4;
var zPosition = 0;
var speed = 0;

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

function start()
{
	canvas = document.getElementById("glcanvas");

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
		
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

		// Zanka
		setInterval(function() {
			if (texturesLoaded)
			{
				requestAnimationFrame(animate);
				handleKeys();
				drawScene();
			}
		}, 15);
	}
}
