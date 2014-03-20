var themeApp = angular.module('themeApp', ['ui.slider','colorpicker.module', 'ngRoute']);

// Directives
themeApp.directive('colorChooser', function(){
	return{
		scope: {
			color:'=',
			label:'=',
			update:'='
		},
		templateUrl: '/templates/colorChooser.html'
	}
});

themeApp.directive('downloadItem', function(){
	return {
		scope: {
			extension:'=',
			theme:'='
		},
		link: function (scope, elem, attrs) {	
			$(elem).click(function(){
				var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(scope.theme);

				var downloadLink = document.createElement("a");
				downloadLink.href = uri;
				downloadLink.download = "data." + scope.extension;

				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			});
		}
	}
});

// Route configurations
themeApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/theme', {
			templateUrl: 'templates/main.html',
			controller: 'themeController'
		})
		.when('/about', {
			templateUrl: 'templates/about.html',
			controller: 'themeController'
		})
		.otherwise({ redirectTo: '/theme'});
}]);

// Factories
themeApp.factory('ColorSettings', [function(){
	/* Private */
	var stringMultiplyer = -1.5;
	var numberMultiplyer = -1.25;
	var preprocessorMultiplyer = 1.5;

	//maybe make a function instead
	var colorSettings = {
		main: null,
		foreground: null,
		background: null,
		contrast: null,
		update: function(){
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
	}

	//this is messy - initializing
	colorSettings.main = "#2FCEFE"; 
	colorSettings.foreground = "#CFCFCF";
	colorSettings.background = "#383838";
	colorSettings.contrast = 110;
	colorSettings.update(); 

	return colorSettings; 
}]);


themeApp.service('ThemeService', ['ColorSettings', function(){
	this.generateTheme = function(template, colorSettings){
		//do something to compile the template and apply the data from the colorSettings

		var compiledTemplate = '<div class="test"><p>Hi.</p></div>'; //this is obviously fake at the moment
		return compiledTemplate; 
	};
}]);

// Controllers
themeApp.controller('themeController', ['$scope', 'ColorSettings', 'ThemeService', function($scope, ColorSettings, ThemeService){
	$scope.themeData = ColorSettings;

	$scope.dataItem = ThemeService.generateTheme('','');
	$scope.extension = "txt";

	$scope.$watch('themeData.contrast', function() {
		$scope.themeData.update();
	});
}]);