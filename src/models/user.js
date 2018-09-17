const _ = require('lodash');
const errors = require('common-errors');
const BPromise = require('bluebird');
const queryHelper = require('../helpers/query');

const { NotFoundError } = errors.NotFoundError;
const { method } = BPromise;

module.exports = (sequelize, DataTypes) => {
  const User = {};
  const schema = {
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true, notEmpty: true } },
    username: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    password: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    lastSeenAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
    deletedAt: { type: DataTypes.DATE },
  };

  _.mapValues(schema, (v, k) => _.assign(v, { field: _.snakeCase(k) }));

  const UserModel = sequelize.define('user', schema, {
    paranoid: true,
    freezeTableName: true,
    getterMethods: {
      name() {
        if (this.firstName && this.lastName) {
          return `${this.firstName} ${this.lastName}`;
        } else if (this.firstName) {
          return this.firstName;
        } else if (this.lastName) {
          return this.lastName;
        } else if (this.username) {
          return this.username;
        }

        return undefined;
      },
    },
  });

  UserModel.associate = () => {
    /**
     * Search Users
     *  - Returns all users matching query
     *  @param {object} options
     */
    User.search = method((options = {}) => {
      return UserModel
        .findAll(queryHelper.buildQuery(options))
        .catch(sequelize.DatabaseError, queryHelper.errorWrapper);
    });

    User.update = method((id, payload = {}, transaction = null) => {
      return UserModel
        .update(payload, { where: { id }, returning: true, transaction })
        .spread((count, users) => {
          if (count < 1) throw new NotFoundError(`No user with id: ${id}.`);
          return users;
        });
    });
  };

  User.model = UserModel;

  return User;
};
