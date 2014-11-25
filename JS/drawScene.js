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
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	//Nastavi teksturne koordinate
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	// Set the normals attribute for vertices.
  	gl.bindBuffer(gl.ARRAY_BUFFER,worldVertexNormalBuffer);
  	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, worldVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//Nastavi medpomilnike
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//Parametri osvetlitve
	gl.uniform3f( shaderProgram.ambientColorUniform, 0.27, 0.27, 0.3);
	var lightingDirection = [ 1, -1, 1];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);
    //gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
    //gl.uniform3f( shaderProgram.directionalColorUniform, 1, 0, 0);

	var lucX= 0.5;
	var lucY= 1.5;
	var lucZ= 2;

	mat4.identity(lightMatrix);
	mat4.rotate(lightMatrix, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(lightMatrix, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(lightMatrix, [-xPosition + lucX, -yPosition + lucY, -zPosition + lucZ]);
	
    gl.uniform3f( shaderProgram.pointLightingLocationUniform, lightMatrix[12] , lightMatrix[13] , lightMatrix[14] );
    gl.uniform3f( shaderProgram.pointLightingColorUniform, 0.75, 0.7 ,0.65 );

	// Izrisi tla spodaj
	gl.bindTexture(gl.TEXTURE_2D, grassTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, 12);
	
	//Izrisi tla zgoraj
	gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 12, 6);
	
	//Izrisi glavne steene
	gl.bindTexture(gl.TEXTURE_2D, wallTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 18, 36);
	
	//Izrisi stene od terase
	gl.bindTexture(gl.TEXTURE_2D, brickTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 54, 21);
	
	//Izrisi rampo
	gl.bindTexture(gl.TEXTURE_2D, floorTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 75, 12);
	
	//Izrisi nebo
	gl.bindTexture(gl.TEXTURE_2D, skyTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 87, 42);
}