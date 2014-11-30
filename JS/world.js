function loadWorld()
{
	//Nalozi svet iz datoteke world.txt
	var request = new XMLHttpRequest();
	request.open("GET", "./ostalo/world.txt", false);
	request.send();
	
	var lines = request.responseText.split("\n");
	var vertexCount = 0;
	var vertexPositions = [];
	var vertexTextureCoords = [];
	var vertexNormals = [];
	for (var i in lines) {
		var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
		if (vals.length == 8 && vals[0] != "//") {
			// It is a line describing a vertex; get X, Y and Z first
			vertexPositions.push(parseFloat(vals[0]));
			vertexPositions.push(parseFloat(vals[1]));
			vertexPositions.push(parseFloat(vals[2]));

			// And then the texture coords
			vertexTextureCoords.push(parseFloat(vals[3]));
			vertexTextureCoords.push(parseFloat(vals[4]));

			//In se normale
			vertexNormals.push(parseFloat(vals[5]));
			vertexNormals.push(parseFloat(vals[6]));
			vertexNormals.push(parseFloat(vals[7]));

			vertexCount += 1;
		}
	}

	//Sedaj pa se parsaj obj datoteke
	//Najprej pridobi iz ajaxa
	//Nalozi objekte iz datoteke .obj
	
	var objekti= ["tree-04.obj", "lion-statue.obj", "street-light.obj"];
	
	for( k=0; k<objekti.length; k++)
	{
		var request = new XMLHttpRequest();
		request.open("GET", "./ostalo/" + objekti[k], false);
		request.send();
		var lines = request.responseText.split("\n");
	
		var ogljisca= [];
		var normale= [];
		var texKordinate= [];
	
		for (var i in lines)
		{
			var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
			if (vals.length > 0 && vals[0] != "//")
			{
				
				if(vals[0] == "v")
				{
					ogljisca.push( parseFloat( vals[1] ) );
					ogljisca.push( parseFloat( vals[2] ) );
					ogljisca.push( parseFloat( vals[3] ) );
				}else if(vals[0] == "vt")
				{
					texKordinate.push( parseFloat( vals[1] ));
					texKordinate.push( parseFloat( vals[2] ));
				} else if(vals[0] == "vn")
				{
					normale.push( parseFloat( vals[1] ));
					normale.push( parseFloat( vals[2] ));
					normale.push( parseFloat( vals[3] ));
				} else if(vals[0] == "f")
				{
					if(vals[1].indexOf("//") < 1)
					{
						//Z texturnimi kordinatami
						for( var j=1; j<4; j++)
						{
							var vrednosti = vals[j].replace(/^\s+/, "").split("/");
						
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -3] );
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -2] );
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -1] );
						
							vertexTextureCoords.push(texKordinate[2*vrednosti[1] -2]);
							vertexTextureCoords.push(texKordinate[2*vrednosti[1] -1]);
						
							vertexNormals.push( normale[ 3*vrednosti[2] -3] );
							vertexNormals.push( normale[ 3*vrednosti[2] -2] );
							vertexNormals.push( normale[ 3*vrednosti[2] -1] );
						
							vertexCount++;
						}
					}else
					{
						//Brez tex kordinat
						for( var j=1; j<4; j++)
						{
							var vrednosti = vals[j].replace(/^\s+/, "").split("//");
					
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -3] );
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -2] );
							vertexPositions.push( ogljisca[ 3*vrednosti[0] -1] );
						
							vertexTextureCoords.push(0);
							vertexTextureCoords.push(0);
						
							vertexNormals.push( normale[ 3*vrednosti[1] -3] );
							vertexNormals.push( normale[ 3*vrednosti[1] -2] );
							vertexNormals.push( normale[ 3*vrednosti[1] -1] );
						
							vertexCount++;
						}
					}
				}
			}
		}
	}
	
	//alert("Vert: " + vertexCount + "VertArr" + vertexPositions.length + "Tex:" + vertexTextureCoords.length + "Normals:" + vertexNormals.length);

	//Povezi medpomnilnike
	//Vertexi
	worldVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
	worldVertexPositionBuffer.itemSize = 3;
	worldVertexPositionBuffer.numItems = vertexCount;

	//Normale
	worldVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	worldVertexNormalBuffer.itemSize = 3;
	worldVertexNormalBuffer.numItems = vertexCount;

	//Texture
	worldVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
	worldVertexTextureCoordBuffer.itemSize = 2;
	worldVertexTextureCoordBuffer.numItems = vertexCount;

	document.getElementById("loadingtext").textContent = "";
}