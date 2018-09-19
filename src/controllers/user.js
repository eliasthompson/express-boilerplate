const BaseController = require('./base');
const { ArgumentNullError, NotFoundError } = require('common-errors');

const db = require('../models');
const { QueryError } = require('../helpers/query');

const { User, sequelize } = db;
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

  check(req, res) {
    return User
      .check(req.body)
      .then(res.success)
      .catch(ArgumentNullError, res.badRequest)
      .catch(ValidationError, res.badRequest)
      .catch(QueryError, res.badRequest)
      .catch(NotFoundError, res.notFound)
      .catch(res.serverError);
  }

  /**
   * Update/Creates User
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  update(req, res) {
    return User
      .update(req.body)
      .then(res.success)
      .catch(ArgumentNullError, res.badRequest)
      .catch(ValidationError, res.badRequest)
      .catch(QueryError, res.badRequest)
      .catch(NotFoundError, res.notFound)
      .catch(res.serverError);
  }

  /**
   * Delete User
   * @param req - HTTP Request
   * @param res - HTTP Response
   */
  delete(req, res) {
    return User
      .delete(req.body)
      .then(res.success)
      .catch(ArgumentNullError, res.badRequest)
      .catch(ValidationError, res.badRequest)
      .catch(QueryError, res.badRequest)
      .catch(res.serverError);
  }
};
