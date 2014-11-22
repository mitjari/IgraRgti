//Funkcija za animacijo
function animate()
{
	var timeNow = new Date().getTime();
	if (lastTime != 0)
	{
		var elapsed = timeNow - lastTime;
		if (speed != 0)
		{
			xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;

			joggingAngle += elapsed * 0.6;	//Nastavitev hoje
			yPosition = Math.sin(degToRad(joggingAngle)) / 20 + 0.4;
		}
		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
	}
	lastTime = timeNow;
}