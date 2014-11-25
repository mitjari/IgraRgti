function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {
    return null;
  }
  
  // Walk through the source element's children, building the
  // shader source string.
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
        shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, shaderSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// createProgram
//
// Creates shading program.
//
function initShaders(){
  var fragmentShader = getShader(gl, "per-fragment-lighting-fs");
  var vertexShader = getShader(gl, "per-fragment-lighting-vs");

  // Create the shader program
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

	gl.useProgram(program);
  // store location of aVertexPosition variable defined in shader
  program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");

  // turn on vertex position attribute at specified position
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

  // store location of aVertexNormal variable defined in shader
  program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");

  // turn on vertex texture coordinates attribute at specified position
  gl.enableVertexAttribArray(program.vertexNormalAttribute);

  // store location of aTextureCoord variable defined in shader
  program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");

  // turn on texture coordinate attribure at specified position
  gl.enableVertexAttribArray(program.textureCoordAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
  // store location of uMVMatrix variable defined in shader - model-view matrix 
  program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
  // store location of uNMatrix variable defined in shader - normal matrix 
  program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
  // store location of uSampler variable defined in shader
  program.samplerUniform = gl.getUniformLocation(program, "uSampler");
  // store location of uAmbientColor variable defined in shader
  program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
  // store location of uPointLightingLocation variable defined in shader
  program.pointLightingLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
  // store location of uPointLightingColor variable defined in shader
  program.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");

  shaderProgram= program;
}


function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}