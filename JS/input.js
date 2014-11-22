//Input
function handleKeyDown(event)
{
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event)
{
	currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys()
{
	//Gor dol
	if (currentlyPressedKeys[33]) pitchRate = 0.1;
	else if (currentlyPressedKeys[34]) pitchRate = -0.1;
	else pitchRate = 0;

	//Levo desno
	if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) yawRate = 0.1;
	else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) yawRate = -0.1;
	else yawRate = 0;

	//Naprej nazaj
	if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) speed = 0.003;
	else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) speed = -0.003;
	else speed = 0;
}