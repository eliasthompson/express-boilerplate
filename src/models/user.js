const _ = require('lodash');
const BPromise = require('bluebird');
const queryHelper = require('../helpers/query');
const { ArgumentNullError, NotFoundError } = require('common-errors');

const { method } = BPromise;

module.exports = (sequelize, DataTypes) => {
  const User = {};
  const schema = {
    id: { type: DataTypes.UUID, primaryKey: true, unique: true, allowNull: false, defaultValue: DataTypes.UUIDV4, validate: { isUUID: 4, notEmpty: true } },
    email: { type: DataTypes.TEXT, unique: true, allowNull: false, validate: { isEmail: true, notEmpty: true } },
    username: { type: DataTypes.TEXT, unique: true, allowNull: false, validate: { notEmpty: true } },
    password: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    firstName: { type: DataTypes.TEXT },
    lastName: { type: DataTypes.TEXT },
    lastSeenAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, validate: { isDate: true } },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, validate: { isDate: true } },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, validate: { isDate: true } },
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
        } else if (this.firstName || this.lastName) {
          return this.firstName || this.lastName;
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

    User.update = method((payload = {}) => {
      const where = _.pick(payload, [
        'id',
        'email',
        'username',
      ]);
      const data = {
        ...where,
        ..._.pick(payload, [
          'password',
          'firstName',
          'lastName',
        ]),
      };

      if (!_.size(where)) throw new ArgumentNullError('id, email, and/or username is required to update or create.');

      return UserModel
        .update(data, { where, returning: true })
        .spread((count, users) => {
          if (count < 1) throw new NotFoundError('Record not found.');
          return users;
        })
        .catch(NotFoundError, () => UserModel.create(data, { returning: true }))
        .then(result => _.castArray(result));
    });

    User.delete = method((payload) => {
      const where = _.pick(payload, [
        'id',
        'email',
        'username',
      ]);

      if (!_.size(where)) throw new ArgumentNullError('id, email, and/or username is required to delete.');

      return UserModel
        .destroy({ where })
        .then(() => User.search({ where, paranoid: false }));
    });
  };

  User.model = UserModel;

  return User;
};
