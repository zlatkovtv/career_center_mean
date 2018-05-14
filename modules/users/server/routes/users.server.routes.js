'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users/:userId').get(users.getUserById);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users').put(users.update);
  app.route('/api/users/students').get(users.getAllStudents);
  app.route('/api/users/premium')
  .post(users.savePremium)
  app.route('/api/users/premium/:userId')
  .delete(users.cancelPremium);
  app.use(multipartyMiddleware).route('/api/users/files').post(users.uploadFilesForUser);
  app.route('/api/users/files/:fileId').get(users.downloadFileById);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
