var themeApp = angular.module('themeApp', ['ui.slider','colorpicker.module', 'ngRoute', 'themeList']);

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

//probably wrap all of this up in the download directive -- although maybe this is better if we're going to display
//this stuff as well so people on browsers that don't support download can copy paste
themeApp.service('ThemeService', ['$http', '$q', '$compile', function($http, $q, $compile){
	this.generateTheme = function(templatePath){
		//do something to compile the template and apply the data from the colorSettings
		var deferred = $q.defer();
		$http({
		    url: templatePath,
		    method: "GET",
		}).success(function(data, status, headers, config) {
			var compiler = $compile(data);
 		    deferred.resolve(compiler); 
		}).error(function(data, status, headers, config) {
			//do something
		});

		return deferred.promise; 
	};
}]);

// Controllers
themeApp.controller('themeController', ['$scope', 'ColorSettings', 'ThemeService', 'themeList', function($scope, ColorSettings, ThemeService, themeList){
	$scope.themeData = ColorSettings;

	var item = ThemeService.generateTheme(themeList.getTheme("Visual Studio 2008").path, $scope);
	$scope.dataItem = item.then(function(data){
		debugger;
		var a = data($scope); 

	});
	$scope.extension = "txt";

	$scope.$watch('themeData.contrast', function() {
		$scope.themeData.update();
	});
}]);