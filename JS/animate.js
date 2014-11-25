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
				//Preprecimo prehitro premikanje pi hkratnem premikanju vstan in naprej
				speed = speed /1.5;
				strafingSpeed	= strafingSpeed/1.5;
			}
			
			var xPosPrevious=xPosition;
			var zPosPrevious=zPosition;
			
			xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;
			
			xPosition -= Math.cos(degToRad(yaw)) * strafingSpeed * elapsed;
			zPosition += Math.sin(degToRad(yaw)) * strafingSpeed * elapsed;

			joggingAngle += elapsed * 0.75;	//Nastavitev hoje
			
			if(xPosition>1.5 && xPosition<2 && zPosition<10 && zPosition>7.5){
				cameraHeigth=(Math.abs(zPosition-10)/2.5)+0.4;
				yPosition = Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
			}
			
			if((xPosition<1.9 && zPosition>10.1) || zPosition<6.9 || (xPosition<1.5 && zPosition>7.0 && zPosition<10)){
				if(cameraHeigth>0.4){
					cameraHeigth -= gravity;
					yPosition -= gravity;
				}else{
					yPosition =  Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
				}
			}else if(xPosition>2.1  && zPosition>7.1){
				yPosition = Math.sin(degToRad(joggingAngle)) / 20 + cameraHeigth;
			}
			
			if (xPosition<0.1 || zPosition<0.1 || zPosition>11.9 || xPosition>6.9 || (xPosition>1.4 && zPosition>6.9 && zPosition<7.1 && cameraHeigth<1.3) || (xPosition>1.4 && xPosition<1.6 && zPosition>6.9 && zPosition<10.1 && cameraHeigth==0.4) || (xPosition>1.9 && xPosition<2.1 && zPosition>7.5 && cameraHeigth<1.3)){
				xPosition=xPosPrevious;
				zPosition=zPosPrevious;
				yPosition=cameraHeigth;
			}
	

		}else if(speed==0 || strafingSpeed==0){
			if (cameraHeigth > 0.4){
				if((xPosition<1.9 && zPosition>10.1) || zPosition<6.9 || (xPosition<1.5 && zPosition>7.0 && zPosition<10)){
			
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
		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
	}
	lastTime = timeNow;
}