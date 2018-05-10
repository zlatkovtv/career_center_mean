(function () {
	'use strict';

	angular
		.module('core')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', 'Authentication'];

	function HomeController($scope, Authentication) {
		$scope.user = Authentication.user;
		console.log($scope.user);
		$scope.author = "Konstantin Zlatkov";
		$scope.authorText = `I am a student of Technical University of Sofia and this the application that serves as my dissertation. It's goal is to more easily connect students, faculty members
		and employers into one single platform in which every side can exchange information about one another and engage in possible employment.`;
		$scope.techText = "Made with";
		$scope.techImages = [
			"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1000px-Angular_full_color_logo.svg.png",
			"https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2000px-Node.js_logo.svg.png",
			"http://assets.stickpng.com/thumbs/58481021cef1014c0b5e494b.png"
		];
	}
}());
