function initTextures()
{
	//grass
	grassTexture = gl.createTexture();
	grassTexture.image = new Image();
	grassTexture.image.onload = function() {handleTextureLoaded(grassTexture);};
	grassTexture.image.src = "./teksture/grass.png";
	
	//floor
	floorTexture = gl.createTexture();
	floorTexture.image = new Image();
	floorTexture.image.onload = function() {handleTextureLoaded(floorTexture);};
	floorTexture.image.src = "./teksture/floor3.png";
	
	//bricks
	brickTexture = gl.createTexture();
	brickTexture.image = new Image();
	brickTexture.image.onload = function() {handleTextureLoaded(brickTexture);};
	brickTexture.image.src = "./teksture/bricks3.png";
	
	//Wall
	wallTexture = gl.createTexture();
	wallTexture.image = new Image();
	wallTexture.image.onload = function() {handleTextureLoaded(wallTexture);};
	wallTexture.image.src = "./teksture/wall3.png";
	
	//sky
	skyTexture = gl.createTexture();
	skyTexture.image = new Image();
	skyTexture.image.onload = function() {handleTextureLoaded(skyTexture);};
	skyTexture.image.src = "./teksture/stars1.png";
	
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