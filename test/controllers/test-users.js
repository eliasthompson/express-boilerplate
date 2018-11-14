const { expect } = require('chai');
const UserController = require('../../src/controllers/user');
const logger = require('../../src/lib/utils/logger')
  .getLogger({
    filePath: './logs/log.txt',
    level: 'info',
  });

const userController = new UserController();

describe('Get list of users', () => {
  it('should be a list of users', async () => {
    const req = {
      query: {},
    };
    const res = {
      success: {
        status: 200,
      },
      badRequest: {
        status: 500,
      },
    };
    logger.info(await userController.search(req, res));
    expect(await userController.search(req, res)).to.be.an('array').that.is.not.empty;
  });
});

describe('user update', () => {
  it('user should be able to login', async () => {
    const req = {
      body: {
        username: 'kylethejete',
        email: 'kyle.jeter@evgo.com',
        firstName: 'kyle',
        lastName: 'jete',
        password: 'test1234',
        settings: { lang: 'en' },
      },
    };
    const res = {
      success: {
        status: 200,
      },
      badRequest: {
        status: 500,
      },
    };
    expect(await userController.update(req, res));
  });
});
