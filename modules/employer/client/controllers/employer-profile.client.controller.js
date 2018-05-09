(function () {
	'use strict';

	angular
		.module('employer')
		.controller('EmployerProfileController', EmployerProfileController);

	EmployerProfileController.$inject = ['$scope', 'Notification', 'UsersService', 'Authentication', 'Upload', '$uibModal'];

	function EmployerProfileController($scope, Notification, UsersService, Authentication, Upload, $uibModal) {
		$scope.user = Authentication.user;
		console.log($scope.user);
		$scope.premiumPaymentAmount = 9.99;

		$scope.validateCurrentForm = () => {
			if (!$scope.user.employerMetadata.companyName || !$scope.user.employerMetadata.companyWebsite || !$scope.user.employerMetadata.companyPhone) {
				$scope.isSaveEnabled = false;
				return;
			}

			$scope.isSaveEnabled = true;
		};

		$scope.save = () => {
			var usersService = new UsersService($scope.user);
			usersService.$update(function (response) {
				if ($scope.picFile) {
					Upload.upload({
						url: '/api/users/picture',
						data: {
							newProfilePicture: $scope.files.picFile
						}
					}).then(function (response) {
						Authentication.user = response.data;
					});
				}
				
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Employer profile successfully updated!', delay: 3000 });
				Authentication.user = response;
			}, function (response) {
				Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!', delay: 3000 });
			});
		};

		angular.element(document).ready(function () {
			if(!$scope.user.premium) {
				paypal.Button.render({
					env: 'sandbox', 
		
					style: {
						label: 'checkout',
						size:  'responsive',    // small | medium | large | responsive
						shape: 'rect',     // pill | rect
						color: 'gold'      // gold | blue | silver | black
					},
		
					client: {
						sandbox:    'AW4lsBo0c7OpsZIKWXM4QJo24t22uAYJ7WDN0CG6hUK8XBAmdaxw8EMS5PX0IHweCAgETGqBFNs9LdtG', // from https://developer.paypal.com/developer/applications/
						production: 'AbN27NSXb6N1bYyh_eu_tyxsPJgQwB574GMxDQxapH3NRV33b8ez_TKuBjsqntt_d_mEHHlg5uhOBeMY'  // from https://developer.paypal.com/developer/applications/
					},
			
					payment: function(data, actions) {
						return actions.payment.create({
							transactions: [
								{
									amount: {
										total: $scope.premiumPaymentAmount,
										currency: 'EUR'
									}
								}
							]
						});
					},
					commit: true,
					onAuthorize: function(data, actions) {
						return actions.payment.execute().then(function(response) {
							savePremium(function() {
								showPayPalSuccessModal();
							});
	
							
						});
					},
					onCancel: function(data) {
						//showPayPalCanceledModal();
						savePremium(function() {
							showPayPalSuccessModal();
						});
					}
			
				}, '#paypal-button');
			}
		});

		function showPayPalSuccessModal() {
			var modalInstance = $uibModal.open({
				templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
				controller: 'ConfirmController',
				resolve: {
					options: {
						title: 'You have successfully activated Premium. Welcome aboard!',
						no: 'Let\'s go!',
						noColor: 'success'
					}
				}
			});
		}

		function showPayPalCanceledModal() {
			var modalInstance = $uibModal.open({
				templateUrl: '/modules/templates/client/views/confirm.client.modal.html',
				controller: 'ConfirmController',
				resolve: {
					options: {
						title: 'The payment was canceled. No funds have been withdrawn from your paypal account. We hope that you will still concider activating Premium.',
						no: 'Close',
						noColor: 'primary'
					}
				}
			});
		}

		function savePremium(showSuccessModal) {
			$scope.user.premium = {
				amount: $scope.premiumPaymentAmount
			}
			
			$scope.user = UsersService.savePremium({}, $scope.user, function (response) {
				$scope.user = response;
				console.log($scope.user);
				showSuccessModal();
            }, function (response) {
            });
		}

		$scope.validateCurrentForm();
	}
}());
