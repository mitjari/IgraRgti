//Funkcija za animacijo
function animate()
{
	var timeNow = new Date().getTime();
	if (lastTime != 0)
	{
		var elapsed = timeNow - lastTime;
		if (speed != 0 || strafingSpeed != 0)
		{
			if(speed != 0 && strafingSpeed != 0)
			{
				//Preprecimo prehitro premikanje pi hkratnem premikanju vstan in naprej
				speed = speed /1.5;
				strafingSpeed	= strafingSpeed/1.5;
			}
			
			xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;
			
			xPosition -= Math.cos(degToRad(yaw)) * strafingSpeed * elapsed;
			zPosition += Math.sin(degToRad(yaw)) * strafingSpeed * elapsed;

			joggingAngle += elapsed * 0.75;	//Nastavitev hoje
			yPosition = Math.sin(degToRad(joggingAngle)) / 20 + 0.4;
		}
		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
	}
	lastTime = timeNow;
}