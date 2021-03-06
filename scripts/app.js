var themeApp = angular.module('themeApp', ['ui.slider','angularSpectrumColorpicker', 'ngRoute', 'themeList']);

// Directives
themeApp.directive('colorChooser', function(){
	return{
		scope: {
			color:'=',
			label:'='
		},
		templateUrl: '/templates/colorChooser.html'
	};
});
themeApp.directive('downloadItem', ['$http', '$q', '$interpolate', function($http, $q, $interpolate){
	return {
		scope: {
			themeSettings:'=',
			themeData:'&'
		},
		template: '<button ng-click="initiateDownload()" class="btn">Download</button>',
		controller: function($scope, $element){
			$scope.initiateDownload = function(){
				$http({
						url: $scope.themeSettings.path,
						method: "GET",
				}).success(function(data, status, headers, config) {
					$scope.outputData = ($scope.themeSettings.format && $scope.themeSettings.format($scope.themeData)) || $scope.themeData;
					var interpolated = $interpolate(data)($scope);

					var blob = new Blob([interpolated], {type: 'application/octet-stream'})	
					saveAs(blob, "themeGenerator" + $scope.themeSettings.extension);

				}).error(function(data, status, headers, config) {
					//do something
				});

			};
		}
	};
}]);

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
			var that = this; 
			//figure out if this is a dark or light background and set shade multiplyer
			//this multiplyer will be used against the colors to determine if you should rotate in a postive or negative direction
			var shadeMultiplyer =  Color(that.background).light() ? 1 : -1; 

			//do the math stuff to get the rest of them						
			that.color1 = Color(that.main).rotate(that.contrast / stringMultiplyer).hexString(); //magic
			that.color2 = Color(that.main).rotate(that.contrast / numberMultiplyer).hexString(); //magic
			that.color3 = that.main; //randomly this one is the same color as the main color in the original code.
			that.color4 = that.foreground; 
			that.color5 = Color(that.main).rotate(that.contrast/(-1 * shadeMultiplyer)).hexString(); 
			that.color6 = Color(that.color5).lighten(0.20 * shadeMultiplyer).hexString();
			that.color7 = that.foreground; 
			that.color8 = that.background; 
			that.color9 = Color(that.main).rotate(that.contrast / preprocessorMultiplyer).hexString(); 

			that.comment = Color(that.foreground).rotate(shadeMultiplyer * 30).hexString(); 
			that.error =  Color("#F00").lighten(0.40);
		},
		initialize: function(){
			var that = this; 

			that.main = "#2FCEFE"; 
			that.foreground = "#CFCFCF";
			that.background = "#383838";
			that.contrast = 110;
			that.update(); 
		}
	};

	colorSettings.initialize(); 
	return colorSettings; 
}]);

// Controllers
themeApp.controller('themeController', ['$scope', 'ColorSettings', 'themeList', function($scope, ColorSettings, themeList){
	$scope.themeData = ColorSettings;
	$scope.showAdvanced = false; 

	$scope.toggleAdvanced = function(){
		$scope.showAdvanced = $scope.showAdvanced == true ? false : true;
	}
	$scope.themeSettings = themeList.getTheme("Visual Studio 2013");

	//i want watchGroup now! ha
	$scope.$watch('themeData.main', function() {
		$scope.themeData.update();
	});

	$scope.$watch('themeData.background', function() {
		$scope.themeData.update();
	});

	$scope.$watch('themeData.foreground', function() {
		$scope.themeData.update();
	});

	$scope.$watch('themeData.contrast', function() {
		$scope.themeData.update();
	});

}]);

themeApp.controller('pageController', ['$scope', 'ColorSettings', function($scope, ColorSettings){
	$scope.resetColors = function(){
		ColorSettings.initialize();
	};
}]);