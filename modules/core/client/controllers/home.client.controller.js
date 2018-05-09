(function () {
	'use strict';

	angular
		.module('core')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope'];

	function HomeController($scope) {
		$scope.author = "Konstantin Zlatkov";
		$scope.authorText = `Lorem ipsum dolor sit amet, ut nihil labores accusam vim, id repudiare scribentur his, ex has congue graece erroribus. Mazim luptatum antiopam pro te. Ne pro feugait denique incorrupte, et qui erat explicari disputationi. In labore dicunt pri, ea nam facer tempor regione.`;
		$scope.techText = "Made with";
		$scope.techImages = [
			"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1000px-Angular_full_color_logo.svg.png",
			"https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2000px-Node.js_logo.svg.png",
			"http://assets.stickpng.com/thumbs/58481021cef1014c0b5e494b.png"
		];
	}
}());
