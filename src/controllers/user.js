const BaseController = require('./base');
const db = require('../models');
const { QueryError } = require('../helpers/query');

const { User, UserSettings, sequelize } = db;
const { ValidationError } = sequelize;

module.exports = class UserController extends BaseController {
  /**
   * Search Users
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  search(req, res) {
    return User
      .search(req.query)
      .then(res.success)
      .catch(QueryError, res.badRequest)
      .catch(res.serverError);
  }

  /**
   * Search UserSettings
   *  - Returns user settings for user
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  searchSettings(req, res) {
    return UserSettings
      .search(req.user.id)
      .then(res.success)
      .catch(res.serverError);
  }

  /**
   * Update UserSettings
   *  - Modifies/Creates the user settings
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  updateSettings(req, res) {
    return UserSettings
      .update(req.user.id, req.body)
      .then(res.success)
      .catch(ValidationError, res.pgValidationError)
      .catch(res.serverError);
  }

  /**
   * List User's Team Members
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  teamMembers(req, res) {
    return User
      .getShareTargets(null, req.user.teams)
      .then(res.success)
      .catch(res.serverError);
  }
};
