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