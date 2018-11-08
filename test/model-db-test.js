const expect = require('chai').expect;
const sinon = require('sinon');
const db = require('../src/models');
const config = require('config').get('development.logger');

const {
  User,
} = db;
const logger = require('../utils/logger')
  .getLogger(config);

describe('User functionality', () => {
  it('should be a model object', async () => {
    const UserModel = await User;

    logger.info(`UserModel: ${UserModel}`);

    sinon.stub(UserModel, 'search');
    sinon.stub(UserModel, 'login');
    sinon.stub(UserModel, 'update');
    sinon.stub(UserModel, 'delete');

    expect(UserModel).to.be.a('Object');
  });
});
