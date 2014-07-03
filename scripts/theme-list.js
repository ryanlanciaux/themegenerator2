var themeList = angular.module('themeList', []);

themeList.factory('themeList', function(){
	var themes = [
		{name: "Visual Studio 2008", path: "/themes/visual-studio-2008.html", extension: '.vssettings', format: function(themeData){
				return themeData; 
			}
		},
		{name: "Visual Studio 2013", path: "/themes/visual-studio-2013.html", extension: '.vssettings', format: function(themeData){
			var colors = JSON.parse(JSON.stringify(themeData()));
			//this is dumb but vssettings are BGR instead of RGB.
				return {
					main: colors.main.substring(5,8) + colors.main.substring(3, 5) + colors.main.substring(1,3),
					foreground: colors.foreground.substring(5,8) + colors.foreground.substring(3, 5) + colors.foreground.substring(1,3),
					background: colors.background.substring(5,8) + colors.background.substring(3, 5) + colors.background.substring(1,3),
					comment: colors.comment.substring(5,8) + colors.comment.substring(3, 5) + colors.comment.substring(1,3),
					color1: colors.color1.substring(5,8) + colors.color1.substring(3, 5) + colors.color1.substring(1,3),
					color2: colors.color2.substring(5,8) + colors.color2.substring(3, 5) + colors.color2.substring(1,3),
					color3: colors.color3.substring(5,8) + colors.color3.substring(3, 5) + colors.color3.substring(1,3),
					color4: colors.color4.substring(5,8) + colors.color4.substring(3, 5) + colors.color4.substring(1,3),
					color5: colors.color5.substring(5,8) + colors.color5.substring(3, 5) + colors.color5.substring(1,3),
					color6: colors.color6.substring(5,8) + colors.color6.substring(3, 5) + colors.color6.substring(1,3),
					color7: colors.color7.substring(5,8) + colors.color7.substring(3, 5) + colors.color7.substring(1,3),
					color8: colors.color8.substring(5,8) + colors.color8.substring(3, 5) + colors.color8.substring(1,3),
					color9: colors.color9.substring(5,8) + colors.color9.substring(3, 5) + colors.color9.substring(1,3)
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