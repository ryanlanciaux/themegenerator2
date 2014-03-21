var themeList = angular.module('themeList', []);

themeList.factory('themeList', function(){
	var themes = [
		{name: "Visual Studio 2008", path: "/themes/visual-studio-2008.html", extension: '.config'}
	];

	//http://stackoverflow.com/a/7364247 -- want to do this without underscore and have it so objects can be defined like they are above
	//basically we're just converting the array from index based to name based so we can search that way
	var lookup = {};
	for (var i = 0, len = themes.length; i < len; i++) {
	    lookup[themes[i].name] = themes[i];
	}

	var factoryObject = {
		getTheme: function(name){
			return lookup[name];
		},
		getThemes: function(){
			return themes; 
		}
	}

	return factoryObject;
});