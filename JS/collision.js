function collision(x,z,heigthCamera){

	if (x<0.2 || z<0.2 || z>11.8 || x>6.8 || (x>1.3 && z>6.8 && z<7.1 && heigthCamera<1.3) || (x>1.3 && x<1.6 && z>6.9 && z<10.1 && heigthCamera==0.4) || (x>1.8 && x<2.1 && z>7.5 && heigthCamera<1.3)){
		return(true);
	}
	
	return(false);
}