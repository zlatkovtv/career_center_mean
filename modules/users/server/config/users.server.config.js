'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  deepPopulate = require('mongoose-deep-populate')(mongoose);

  User.schema.plugin(deepPopulate, {});

/**
 * Module init function
 */
module.exports = function (app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  // Konstantin this gets called every time you refresh the web app and overrides $window.user
  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }).select('-salt -password').deepPopulate('studentMetadata.cv studentMetadata.motivation studentMetadata.recommendation studentMetadata.additionalDocument facultyMetadata employerMetadata').exec(function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
