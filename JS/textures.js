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
	
	//box1
	boxTexture1 = gl.createTexture();
	boxTexture1.image = new Image();
	boxTexture1.image.onload = function() {handleTextureLoaded(boxTexture1);};
	boxTexture1.image.src = "./teksture/box1.png";
	
	//box2
	boxTexture2 = gl.createTexture();
	boxTexture2.image = new Image();
	boxTexture2.image.onload = function() {handleTextureLoaded(boxTexture2);};
	boxTexture2.image.src = "./teksture/box2.png";
	
	//LionBase
	lionBaseTexture = gl.createTexture();
	lionBaseTexture.image = new Image();
	lionBaseTexture.image.onload = function() {handleTextureLoaded(lionBaseTexture);};
	lionBaseTexture.image.src = "./teksture/lion/base.png";
	
	//LionBase
	lionTexture = gl.createTexture();
	lionTexture.image = new Image();
	lionTexture.image.onload = function() {handleTextureLoaded(lionTexture);};
	lionTexture.image.src = "./teksture/lion/lion.jpg";
	
	//Light
	lightTexture = gl.createTexture();
	lightTexture.image = new Image();
	lightTexture.image.onload = function() {handleTextureLoaded(lightTexture);};
	lightTexture.image.src = "./teksture/light2.png";
	
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