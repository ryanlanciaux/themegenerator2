var themeList = angular.module('themeList', []);

themeList.factory('themeList', function(){
	var themes = [
		{name: "Visual Studio 2008", path: "/themes/visual-studio-2008.html", extension: '.vssettings', format: function(themeData){
				return themeData; 
			}
		},
		{name: "Visual Studio 2013", path: "/themes/visual-studio-2013.html", extension: '.vssettings', format: function(themeData){
			var colors = JSON.parse(JSON.stringify(themeData()));
				return {
					main: colors.main.replace("#", ""),
					foreground: colors.foreground.replace("#", ""),
					background: colors.background.replace("#", ""),
					color1: colors.color1.replace("#", ""),
					color2: colors.color2.replace("#", ""),
					color3: colors.color3.replace("#", ""),
					color4: colors.color4.replace("#", ""),
					color5: colors.color5.replace("#", ""),
					color6: colors.color6.replace("#", ""),
					color7: colors.color7.replace("#", ""),
					color8: colors.color8.replace("#", ""),
					color9: colors.color9.replace("#", ""),
				};
			}
		}
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