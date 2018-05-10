(function () {
    'use strict';

    angular
    .module('faculty.services')
    .factory('FacultyService', FacultyService);

    FacultyService.$inject = ['$resource'];

    function FacultyService($resource) {
        var Users = $resource('/api/faculty', {
            classId: '@classId',
            enrolmentId: '@enrolmentId'
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
            getTranscript: {
                method: 'GET',
                url: '/api/faculty/transcript/:enrolmentId'
            },
            saveStudentTranscript: {
                method: 'POST',
                url: '/api/faculty/transcript'
            },
            generateTranscriptPdf: {
                method: 'GET',
                url: '/api/faculty/report',
                responseType: 'arraybuffer',
                transformResponse: function (data, headersGetter) {
                    return {
                        data: data
                    };
                }
            }
        });

        return Users;
    }
}());
