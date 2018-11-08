const expect = require('chai').expect;
const sinon = require('sinon');
const db = require('../src/models');
const { User } = db;
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: '/Users/kjeter/Sites/info.log',
      level: 'info',
    }),
  ],
});

logger.info(`User object: ${User}`);

describe('User functionality', () => {
  it('should be a model object', async () => {
    const UserModel = await User;

    sinon.stub(UserModel, 'search');
    sinon.stub(UserModel, 'login');
    sinon.stub(UserModel, 'update');
    sinon.stub(UserModel, 'delete');

    expect(UserModel).to.be.a('Object');
  });
});
