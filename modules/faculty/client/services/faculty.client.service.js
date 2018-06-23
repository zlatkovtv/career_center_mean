(function () {
    'use strict';

    angular
    .module('faculty.services')
    .factory('FacultyService', FacultyService);

    FacultyService.$inject = ['$resource'];

    function FacultyService($resource) {
        var Users = $resource('/api/faculty', {
            classId: '@classId',
            enrolmentId: '@enrolmentId',
            studentId: '@studentId'
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
                url: '/api/faculty/class/',
                isArray: true
            },
            getEnrolmentsByClassId: {
                method: 'GET',
                url: '/api/faculty/class/:classId',
                isArray: true
            },
            getStudentTranscripts: {
                method: 'GET',
                url: '/api/faculty/transcript',
                isArray: true
            },
            getTranscriptByEnrolmentId: {
                method: 'GET',
                url: '/api/faculty/transcript/:enrolmentId'
            },
            getTranscriptsByStudentId: {
                method: 'POST',
                url: '/api/faculty/transcript/:studentId',
                isArray: true
            },
            saveStudentTranscript: {
                method: 'POST',
                url: '/api/faculty/transcript'
            },
            generateTranscriptPdf: {
                method: 'POST',
                url: '/api/faculty/report',
                responseType: 'arraybuffer',
                transformResponse: function (data, headersGetter, statusCode) {
                    return {
                        data: data,
                        statusCode: statusCode
                    };
                }
            },
            generateAllTranscriptPdf: {
                method: 'PUT',
                url: '/api/faculty/report',
                responseType: 'arraybuffer',
                transformResponse: function (data, headersGetter, statusCode) {
                    return {
                        data: data,
                        statusCode: statusCode
                    };
                }
            }
        });

        return Users;
    }
}());
