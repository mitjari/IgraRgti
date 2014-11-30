//Funkcija za animacijo
function animate()
{
	var timeNow = new Date().getTime();
	var elapsed = timeNow - lastTime;
	if (lastTime != 0)
	{
		if (speed != 0 || strafingSpeed != 0)
		{
			if(speed != 0 && strafingSpeed != 0)
			{
				//Preprecimo prehitro premikanje pi hkratnem premikanju vstan in naprej,
				//pri premikanju nazaj streljam nazaj kar ni prav ter pri premikanju v stran streljam v stran pri premikanju poševno streljam poševno kar je narobe
				//ko se premikaš nazaj preveri će je speed ko se premikaš nazaj negativna in ko naprej oz s kamero pozitivna, to je res tako da upoštevaj samo pozitivne
				//tako da streljaš naprej in ne nazaj oz vstran tako kot sedaj.
				speed = speed /1.5;
				strafingSpeed	= strafingSpeed/1.5;
			}
			
			previousSpeed = speed;
			previousStrafingSpeed = strafingSpeed;
			var xPosPrevious=xPosition;
			var zPosPrevious=zPosition;
			
			xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;
			
			xPosition -= Math.cos(degToRad(yaw)) * strafingSpeed * elapsed;
			zPosition += Math.sin(degToRad(yaw)) * strafingSpeed * elapsed;
			
			joggingAngle += elapsed * 0.75;	//Nastavitev hoje
			
			if(xPosition>1.5 && xPosition<1.8 && zPosition<10 && zPosition>7.5){
				cameraHeigth=(Math.abs(zPosition-10)/2.5)+0.4;
				yPosition = Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
			}
			
			if((xPosition<1.8 && zPosition>10.1) || zPosition<6.8 || (xPosition<1.3 && zPosition>7.0 && zPosition<10)){
				if(cameraHeigth>0.4){
					cameraHeigth -= gravity;
					yPosition -= gravity;
				}else{
					yPosition =  Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
				}
			}else if(xPosition>2.1  && zPosition>7.1){
				yPosition = Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
			}
				
			if(collision(xPosition,zPosition,cameraHeigth)==true){
				xPosition=xPosPrevious;
				zPosition=zPosPrevious;
				yPosition=cameraHeigth;
			}
			console.log(collision(xPosition,zPosition,cameraHeigth));
		}else if(speed==0 || strafingSpeed==0){
			if (cameraHeigth > 0.4){
				if((xPosition<1.9 && zPosition>10.1) || zPosition<6.8 || (xPosition<1.3 && zPosition>7.0 && zPosition<10)){
			
					cameraHeigth -= gravity;
					yPosition -= gravity;
			
				}
			} else if(cameraHeigth<0.4){
				if((xPosition<1.9 && zPosition>10.1) || zPosition<6.9 || (xPosition<1.5 && zPosition>7.0 && zPosition<10)){
			
					cameraHeigth = 0.4;
					yPosition = cameraHeigth;
				}
			}
		
		}

		if(shoot==true){
			shoot=false

			var cos=Math.cos(degToRad(yaw));
			var sin=Math.sin(degToRad(yaw));
			if(cos>0){
				cos= cos*(-1);
			}else if(cos<0){
				cos=Math.abs(cos);
			}
			if(sin>0){
				sin=sin*(-1);
			}else if(sin<0){
				sin=Math.abs(sin);
			}

			xBullet = xPosition + bulletSpeed * sin;
			zBullet = zPosition + bulletSpeed * cos;
			
			bullets.push([xBullet,zBullet,yaw,cameraHeigth]);
			console.log(bullets);
			console.log(bullets.length);

		}
		
		if(bullets.length > 0){
			for(i=0; i<bullets.length; i++){
				x=bullets[i][0];
				z=bullets[i][1];
				direction=bullets[i][2];
				
				var cos=Math.cos(degToRad(direction));
				var sin=Math.sin(degToRad(direction));
				if(cos>0){
					cos= cos*(-1);
				}else if(cos<0){
					cos=Math.abs(cos);
				}
				if(sin>0){
					sin=sin*(-1);
				}else if(sin<0){
					sin=Math.abs(sin);
				}

				x = x + bulletSpeed * sin;
				z = z + bulletSpeed * cos;
				console.log(x);
				console.log(z);
				if(collision(x,z,bullets[i][3])==true){
					collisionCount+=1;
					bullets.pop(i);
					console.log("collisions");
					console.log(collisionCount);
				}else{
					bullets[i]=[x,z,direction];
				}
				
			}
		}
		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
		if(yaw>0){
			yaw=yaw-360;
		}else if(yaw<-360){
			yaw=0;
		}
		if(pitch > 30){
			pitch=30;
		}else if(pitch<(-30)){
			pitch=-30;
		}

	}
	lastTime = timeNow;

}