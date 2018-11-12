const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../../src/models');

const { User } = db;
const logger = require('../../src/lib/utils/logger')
  .getLogger({ filePath: '../../src/lib/utils/logs/log.txt', level: 'info' });

describe('User functionality', () => {
  it('should be a model object', () => {
    logger.info(`UserModel: ${User.model}`);

    sinon.stub(User.model, 'findAll');
    sinon.stub(User.model, 'findOne');
    sinon.stub(User.model, 'update');

    expect(User.model);
  });
});
