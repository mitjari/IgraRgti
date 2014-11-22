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