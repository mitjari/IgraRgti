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

	var lucX= 1;
	var lucY= 1.5;
	var lucZ= 3;

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
	
	//Izrisi glavne stene
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
	
	//Izrisi skatlo
	// drawBox([x, y, z], rotacija v stopinjah, os vrtenja[x, y, z], skalacija, textura)
	
	//Skatle pri rampi
	drawBox([0.2, 0, 10.6], 0, [0, 0, 0], [2.5, 2.5, 2.5], boxTexture1);
	drawBox([0.8, 0, 10.6], 0, [0, 0, 0], [2.5, 2.5, 2.5], boxTexture1);
	drawBox([0.6, 0.5, 10.6], 30, [0, 1, 0], [2.5, 2.5, 2.5], boxTexture2);
	
	//Zgornje nadstropje
	drawBox([1.8, 1, 11], 20, [0, 1, 0], [2.5, 2.5, 2.5], boxTexture2);
	//kot
	drawBox([6.5, 1, 11.5], 0, [0, 0, 0], [2, 2, 2], boxTexture2);
	drawBox([6.1, 1, 11.5], 0, [0, 0, 0], [2, 2, 2], boxTexture2);
	drawBox([6.6, 1.4, 11.5], 0, [0, 0, 0], [2, 2, 2], boxTexture2);
	drawBox([6.6, 1, 11.1], 10, [0, 1, 0], [2, 2, 2], boxTexture1);
	
	//Spodaj
	drawBox([5.5, 0, 1], 45, [0, 1, 0], [2.5, 2.5, 2.5], boxTexture2);
	drawBox([5.5, 0, 1.5], 0, [0, 0, 0], [2.5, 2.5, 2.5], boxTexture1);
	drawBox([5.5, 0.5, 1.2], 30, [0, 1, 0], [2.5, 2.5, 2.5], boxTexture2);
	drawBox([5.5, 0.3, 2], 40, [1, 0, 0], [2.5, 2.5, 2.5], boxTexture2);
	
	//Izrisi drevesa
	drawTree([2.5, 0, 6], 0, [0, 0, 0], [0.01, 0.02, 0.01]);
	drawTree([5, 0, 1.5], 5, [1, 1, 0], [0.015, 0.02, 0.015]);
	drawTree([6.5, 0, 6.5], 45, [0, 1, 0], [0.02, 0.015, 0.02]);
	
	//Izrisi kip leva
	drawStatue([4, 0.95, 9], 270, [0, 1, 0], [0.15, 0.15, 0.15]);
	
	//Izrisi luc
	drawLight([1, -0.01, 3], 0, [0, 0, 0], [0.3, 0.3, 0.3]);
	
	//Izrisi cvetlisno korito
	drawBox([6.5, 1, 7.5], 0, [0, 0, 0], [2.5, 1.6, 12], wallTexture);
	
	drawTree([6.7, 1.3, 7.7], 10, [0, 1, 0], [0.01, 0.01, 0.015]);
	drawTree([6.7, 1.3, 8.7], 0, [0, 0, 0], [0.015, 0.006, 0.015]);
	drawTree([6.7, 1.3, 9.7], 30, [0, 1, 0], [0.015, 0.008, 0.01]);
	
	for(var st=0; st<bullets.length; st++)
	{
		drawBullet([ bullets[st][0], bullets[st][3], bullets[st][1] ], 0, [0, 0, 0], [0.07, 0.07, 0.07]);
	}
}

function drawBullet(pos, deg, os, scal)
{
	//Izrisi  naboj
	mvPushMatrix();
	
	mat4.translate(mvMatrix, pos);
	mat4.rotate(mvMatrix, degToRad(deg), os);
	mat4.scale(mvMatrix, scal);
	
	gl.bindTexture(gl.TEXTURE_2D, bulletTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 59880, 3309);	// 54366, 5514
	
	mvPopMatrix();
}

function drawLight(pos, deg, os, scal)
{
	//Izrisi lluc
	mvPushMatrix();
	
	mat4.translate(mvMatrix, pos);
	mat4.rotate(mvMatrix, degToRad(deg), os);
	mat4.scale(mvMatrix, scal);
	
	gl.bindTexture(gl.TEXTURE_2D, brickTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 54366, 228);	// 54366, 5514
	
	gl.bindTexture(gl.TEXTURE_2D, lightTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 54594, 60);	// 54366, 5514
	
	gl.bindTexture(gl.TEXTURE_2D, lionBaseTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 54654, 5226);	// 54366, 5514
	
	mvPopMatrix();
}

function drawStatue(pos, deg, os, scal)
{
	//Izrisi leva
	mvPushMatrix();
	
	mat4.translate(mvMatrix, pos);
	mat4.rotate(mvMatrix, degToRad(deg), os);
	mat4.scale(mvMatrix, scal);
	
	gl.bindTexture(gl.TEXTURE_2D, lionTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 23508, 30729);	//30858

	gl.bindTexture(gl.TEXTURE_2D, lionBaseTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 54237, 129);	//30858
	
	mvPopMatrix();
}

function drawTree(pos, deg, os, scal)
{
	//Izrisi drevo
	mvPushMatrix();
	
	mat4.translate(mvMatrix, pos);
	mat4.rotate(mvMatrix, degToRad(deg), os);
	mat4.scale(mvMatrix, scal);
	
	gl.bindTexture(gl.TEXTURE_2D, boxTexture1);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 165, 7602);
	
	gl.bindTexture(gl.TEXTURE_2D, grassTexture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 7767, 15711);
	
	gl.bindTexture(gl.TEXTURE_2D, boxTexture2);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 23478, 30);
	
	mvPopMatrix();
}

function drawBox(pos, deg, os, scal, texture)
{
	mvPushMatrix();
	
	mat4.translate(mvMatrix, pos);
	mat4.rotate(mvMatrix, degToRad(deg), os);
	mat4.scale(mvMatrix, scal);
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 129, 36);
	
	mvPopMatrix();
}