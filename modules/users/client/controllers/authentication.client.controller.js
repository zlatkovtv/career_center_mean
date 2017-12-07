(function () {
    'use strict';

    angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

    function AuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
        var vm = this;

        vm.roleLabels = ['Student', 'Faculty member', 'Employer'];
        vm.userRoleTabs = [
            {
                title: 'Student',
                value: 'student',
                templateUrl: '/modules/templates/client/views/student-signup.client.template.html',
                icon: 'glyphicon-book'
            },
            {
                title: 'Faculty member',
                value: 'faculty',
                templateUrl: '/modules/templates/client/views/faculty-signup.client.template.html',
                icon: 'glyphicon-education'
            },
            {
                title: 'Employer',
                value: 'employer',
                templateUrl: '/modules/templates/client/views/employer-signup.client.template.html',
                icon: 'glyphicon-briefcase'
            }
        ];
        vm.selectedTabTemplateUrl = vm.userRoleTabs[0].templateUrl;
        vm.authentication = Authentication;
        vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
        vm.signup = signup;
        vm.signin = signin;
        vm.callOauthProvider = callOauthProvider;
        vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;

        vm.enableSocialLogin = false;
        vm.credentials = {
            roles: "student"
        };

        // Get an eventual error defined in the URL query string:
        if ($location.search().err) {
            Notification.error({ message: $location.search().err });
        }

        // If user is signed in then redirect back home
        if (vm.authentication.user) {
            $location.path('/');
        }

        function signup(form) {
            if (!form.$valid) {
                $scope.$broadcast('show-errors-check-validity', form);
                return false;
            }

            UsersService.userSignup(vm.credentials)
            .then(onUserSignupSuccess)
            .catch(onUserSignupError);
        }

        function signin(form) {
            if (!form.$valid) {
                $scope.$broadcast('show-errors-check-validity', form);
                return false;
            }

            UsersService.userSignin(vm.credentials)
            .then(onUserSigninSuccess)
            .catch(onUserSigninError);
        }

        // OAuth provider request
        function callOauthProvider(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        }

        // Authentication Callbacks

        function onUserSignupSuccess(response) {
            // If successful we assign the response to the global user model
            vm.authentication.user = response;
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
            // And redirect to the previous or home page
            $state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onUserSignupError(response) {
            Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
        }

        function onUserSigninSuccess(response) {
            // If successful we assign the response to the global user model
            console.log(response);
            vm.authentication.user = response;
            Notification.info({ message: 'Welcome ' + response.displayName + '!' });
            // And redirect to the previous or home page
            $state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onUserSigninError(response) {
            Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
        }

        vm.selectTabObject = (tab) => {
            vm.credentials = {
                roles: tab.value
            };
            vm.selectedTabTemplateUrl = tab.templateUrl;
        };

        vm.print = () => {
                console.log(vm.facultyForm);
        };
    }
}());
