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

//Funkcija za branje programa sencilnika
function getShader(gl, id)
{
	var shaderScript = document.getElementById(id);
	if (!shaderScript) return null;
	
	//Beri program in ga shranjuj v shaderSource
	var shaderSource = "";
	var currentChild = shaderScript.firstChild;
	while (currentChild)
	{
		if (currentChild.nodeType == 3) shaderSource += currentChild.textContent;
		currentChild = currentChild.nextSibling;
	}
	
	//Najdi tip sencilnika
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if (shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);
	else return null;

	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


function initShaders()
{
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	// Program sencilnika
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// Opozori ob napaki pri kreiranju programa sencilnika
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Unable to initialize the shader program.");

	// Zacni uporabljati program
	gl.useProgram(shaderProgram);

	//Povezi spremenljivke
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function setMatrixUniforms()
{
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function initTextures()
{
	wallTexture = gl.createTexture();
	wallTexture.image = new Image();
	wallTexture.image.onload = function() {handleTextureLoaded(wallTexture);};
	wallTexture.image.src = "./teksture/wall.png";
}

function handleTextureLoaded(texture)
{
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);

	gl.bindTexture(gl.TEXTURE_2D, null);

	//Po koncanem nalaganju teksture lahko izrisemo svet
	texturesLoaded = true;
}

function handleLoadedWorld(data) {
  var lines = data.split("\n");
  var vertexCount = 0;
  var vertexPositions = [];
  var vertexTextureCoords = [];
  for (var i in lines) {
    var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
    if (vals.length == 5 && vals[0] != "//") {
      // It is a line describing a vertex; get X, Y and Z first
      vertexPositions.push(parseFloat(vals[0]));
      vertexPositions.push(parseFloat(vals[1]));
      vertexPositions.push(parseFloat(vals[2]));

      // And then the texture coords
      vertexTextureCoords.push(parseFloat(vals[3]));
      vertexTextureCoords.push(parseFloat(vals[4]));

      vertexCount += 1;
    }
  }

  worldVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
  worldVertexPositionBuffer.itemSize = 3;
  worldVertexPositionBuffer.numItems = vertexCount;

  worldVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
  worldVertexTextureCoordBuffer.itemSize = 2;
  worldVertexTextureCoordBuffer.numItems = vertexCount;

  document.getElementById("loadingtext").textContent = "";
}


function loadWorld()
{
	var request = new XMLHttpRequest();
	request.open("GET", "./ostalo/world.txt");
	request.onreadystatechange = function() { if (request.readyState == 4) handleLoadedWorld(request.responseText);};
	request.send();
}

function drawScene()
{
	//Nastavi velikost ter pobrisi
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Prazni medpomnilniki -> preklici
	if (worldVertexTextureCoordBuffer == null || worldVertexPositionBuffer == null) return;
	
	//Nastavi perspektivno projekcijo
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

	//Premakni se v izhodisce
	mat4.identity(mvMatrix);

	//Premakni se v zacetek izrisa
	mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(mvMatrix, [-xPosition, -yPosition, -zPosition]);

	// Aktiviraj teksture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, wallTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	//Nastavi teksturne koordinate
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Nastavi medpomilnike
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Izrisi
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, worldVertexPositionBuffer.numItems);
}

//Funkcija za animacijo
function animate()
{
	var timeNow = new Date().getTime();
	if (lastTime != 0)
	{
		var elapsed = timeNow - lastTime;
		if (speed != 0)
		{
			xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;

			joggingAngle += elapsed * 0.6;	//Nastavitev hoje
			yPosition = Math.sin(degToRad(joggingAngle)) / 20 + 0.4;
		}
		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
	}
	lastTime = timeNow;
}


//Input
function handleKeyDown(event)
{
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event)
{
	currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys()
{
	//Gor dol
	if (currentlyPressedKeys[33]) pitchRate = 0.1;
	else if (currentlyPressedKeys[34]) pitchRate = -0.1;
	else pitchRate = 0;

	//Levo desno
	if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) yawRate = 0.1;
	else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) yawRate = -0.1;
	else yawRate = 0;

	//Naprej nazaj
	if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) speed = 0.003;
	else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) speed = -0.003;
	else speed = 0;
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
