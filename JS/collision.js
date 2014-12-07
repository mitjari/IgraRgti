function collision(x,z,heigthCamera){

	if (x<0.2 || z<0.2 || z>11.8 || x>6.8 || (x>1.3 && z>6.8 && z<7.1 && heigthCamera<1.3) || (x>1.3 && x<1.6 && z>6.9 && z<10.1 && heigthCamera==0.4) || (x>1.8 && x<2.1 && z>7.5 && heigthCamera<1.3)){
		return(true);
	}
	
	if(x<1.5 && z>10.5 && z<11.2){
		return(true);
	}
	
	if(x>6.4 && x<6.6 && z>6.4 && z<6.6 || x>2.4 && x<2.6 && z>5.9 && z<6.1 || x>4.9 && x<5.1 && z>1.4 && z<1.6){
		return(true);
	}
	
	if(x<1.3 && x>0.7 && z<3.3 && z>2.5){
		return(true);
	}
	
	if(x>5.3 && x<6.2 && z>1.4 && z<3 || x>5.3 && x<6.33 && z>0.45 && z<1.4){
		return(true);
	}
	
	if(x>3.4 && x<4.8 && z>8.6 && z<9.3){
		return(true);
	}
	
	if(x>6.3 && z>7.3 && z<10){
		return(true);
	}
	
	if(x>6.4 && z>10.9 || x>5.9 && z>11.3){
		return(true);
	}
	
	if(x>2 && x<2.6 && z>10.6 && z<11.6){
		return(true);
	}
	return(false);
}

function bulletTurret(x,z,heigthCamera){
	
	if(x<xPosition+0.2 && x>xPosition-0.2 && z<zPosition+0.2 && z>zPosition-0.2){
		playerHealth=playerHealth-10;
		if(playerHealth==0){
			if(confirm('Your score: '+score)){
				window.location.reload();  
			}
		}
		return(true);
	}
	
}

function bulletPlayer(x,z,heigthCamera){

	for(i=0; i<turretLocations.length; i++){
		xTurret=turretLocations[i][0];
		zTurret=turretLocations[i][2];
		camera=turretLocations[i][5];
		if(x<xTurret+0.2 && x>xTurret-0.2 && z<zTurret0.2 && z>zTurret-0.2 && heigthCamera<camera&& heigthCamera>camera-0.3){
			turretLocations[i][4]=turretLocations[i][4]-20;
			if(turretLocations[i][4]==0){
				turretLocations.splice(i,1);
				score+=1;
			}
		}
	}
	
}