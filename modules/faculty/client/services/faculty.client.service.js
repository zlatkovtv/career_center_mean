(function () {
    'use strict';

    angular
    .module('faculty.services')
    .factory('FacultyService', FacultyService);

    FacultyService.$inject = ['$resource'];

    function FacultyService($resource) {
        var Users = $resource('/api/faculty', {}, {
            update: {
                method: 'PUT'
            },
            createClass: {
                method: 'POST',
                url: '/api/faculty/class'
            }
        });

        return Users;
    }
}());
