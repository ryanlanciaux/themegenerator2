var themeData = function(main, foreground, background, contrast){
	//these are arbitrary numbers in my (undocumented) code from ~6 years ago -- i do not remember why they are here but
	//for first pass i'm going to keep the math the same then figure out what is going on then make it less magic
	//it may be doing something to figure out the color triad but i don't think so...
	var stringMultiplyer = -1.5; //no clue
	var numberMultiplyer = -1.25; //again no clue
	var preprocessorMultiplyer = 1.5; //no clue

	//set the initial things
	this.main = main; 
	this.foreground = foreground; 
	this.background = background; 
	this.contrast = contrast; 

	this.update = function(){
		that = this; 

		//figure out if this is a dark or light background and set shade multiplyer
		//this multiplyer will be used against the colors to determine if you should rotate in a postive or negative direction
		var shadeMultiplyer =  Color(that.background).light() ? 1 : -1; 

		//do the math stuff to get the rest of them						
		that.color1 = Color(that.main).rotate(that.contrast / stringMultiplyer).hexString(); //magic
		that.color2 = Color(that.main).rotate(that.contrast / numberMultiplyer).hexString(); //magic
		that.color3 = that.main; //randomly this one is the same color as the main color in the original code.
		that.color4 = that.foreground; 
		that.color5 = Color(that.main).rotate(that.contrast/(-1 * shadeMultiplyer)).hexString(); 
		that.color6 = Color(that.color5).lighten(.20 * shadeMultiplyer).hexString();
		that.color7 = that.foreground; 
		that.color8 = that.background; 
		that.color9 = Color(that.main).rotate(that.contrast / preprocessorMultiplyer).hexString(); 

		that.comment = Color(that.foreground).rotate(shadeMultiplyer * 30).hexString(); 
		that.error =  Color("#F00").lighten(.40); 
	}

	this.update();
}