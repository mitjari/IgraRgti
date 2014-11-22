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