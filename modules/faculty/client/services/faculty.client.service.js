(function () {
    'use strict';

    angular
    .module('faculty.services')
    .factory('FacultyService', FacultyService);

    FacultyService.$inject = ['$resource'];

    function FacultyService($resource) {
        var Users = $resource('/api/faculty', {
            classId: '@classId'
        },
        {
            update: {
                method: 'PUT'
            },
            createClass: {
                method: 'POST',
                url: '/api/faculty/class'
            },
            getClassesForUser: {
                method: 'GET',
                url: '/api/faculty/class/all',
                isArray: true
            },
            deleteClass: {
                method: 'DELETE',
                url: '/api/faculty/class/:classId'
            },
            addUserToClass: {
                method: 'POST',
                url: '/api/faculty/class/:classId'
            },
            getEnrolments: {
                method: 'GET',
                url: '/api/faculty/class/:classId',
                isArray: true
            },
            saveStudentTranscript: {
                method: 'POST',
                url: '/api/faculty/transcript'
            }
        });

        return Users;
    }
}());
