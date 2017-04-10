
/*globals angular */
var app = angular.module('cockpit', ['ngRoute', 'ng', 'defaultControllers']);

var controllers = angular.module('defaultControllers', []);

app.config(function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'templates/home.html'
	})
	+++_ROUTES_PLACEHOLDER_+++
	.otherwise({
		redirectTo: '/home'
	});
});

controllers.controller('CockpitCtrl', ['$scope', '$location', '$http',
	function($scope, $location, $http) {
		const API_SIDEBAR = '../../../js/zeus/cockpit/api/sidebar.js';
		const API_MENU = '../../../js/zeus/cockpit/api/menu.js';

		$scope.location = $location;

		$http.get(API_SIDEBAR).success(function (data) {
			$scope.sidebar = data;
			loadPageFromPath($scope.sidebar);
		});

		$http.get(API_MENU).success(function (data) {
			$scope.menu = data;
			loadPageFromPath($scope.menu);
		});

		$scope.setView = function(view) {
			$scope.view = view;
		};

		$scope.setSidebarView = function() {
			$scope.setView('sidebar.html');
		};

		function loadPageFromPath(data) {
			for (var i = 0; i < data.length; i ++) {
				if (data[i].path === $scope.location.path()) {
					$scope.setView(data[i].link);
				}
			}
		}
	}
]);
