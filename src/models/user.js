const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const { method, promisify } = require('bluebird');
const { ArgumentNullError, AuthenticationRequiredError, NotFoundError } = require('common-errors');

const queryHelper = require('../helpers/query');

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

    User.login = method((payload = {}) => {
      const data = _.pick(payload, [
        'username',
        'password',
        'remember',
      ]);

      if (!data.username || !data.username) throw new ArgumentNullError('username and password is required to check credentials.');

      return UserModel
        .findOne(queryHelper.buildQuery({ where: { username: data.username } }))
        .then((result) => {
          if (!result) throw new NotFoundError('We could not find that username.');
          return result;
        })
        .then((result) => {
          return compare(data.password, result.password)
            .then((auth) => {
              if (!auth) throw new AuthenticationRequiredError('Incorrect password.');
              return result;
            });
        })
        .then(result => promisify(jwt.sign)({
          id: result.id,
          name: result.name,
          email: result.email,
          username: result.username,
        }, process.env.JWT_SECRET))
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

      return hash(data.password, 8)
        .then((hashedPassword) => { data.password = hashedPassword; })
        .then(() => UserModel.update(data, { where, returning: true }))
        .spread((count, users) => {
          if (count < 1) throw new NotFoundError('Record not found.');
          return users;
        })
        .catch(NotFoundError, () => UserModel.create(data, { returning: true }))
        .then(result => _.castArray(result))
        .catch(sequelize.DatabaseError, queryHelper.errorWrapper);
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
        .then(() => User.search({ where, paranoid: false }))
        .catch(sequelize.DatabaseError, queryHelper.errorWrapper);
    });
  };

  User.model = UserModel;

  return User;
};
