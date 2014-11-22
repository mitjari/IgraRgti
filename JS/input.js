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

function initMouse(event)
{	
	canvas.requestPointerLock = canvas.requestPointerLock ||canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	canvas.requestPointerLock();
	
	document.addEventListener('mousemove', handleMouse, false);
	
	document.addEventListener('pointerlockchange', releaseCursor, false);
	document.addEventListener('mozpointerlockchange', releaseCursor, false);
	document.addEventListener('webkitpointerlockchange', releaseCursor, false);
}


function releaseCursor()
{
	if (!(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas))
	{
		document.removeEventListener('mousemove', handleMouse);
	}
}


function handleMouse(event)
{
	mouseEvent= event;
}

function premakni()
{
	if( mouseEvent != null )
	{
		var newX= mouseEvent.movementX;
		var newY= mouseEvent.movementY;
	
		var dX= lastMouseX - newX;
		var dY= lastMouseY - newY;
	
		yawRate=  -newX/100;
		pitchRate= -newY/100;
		
		if( normalMouse == true ) mouseEvent= null;
	}
}

