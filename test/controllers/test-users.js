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
    logger.info(`userController ${await userController.search(req, res)}`);
    expect(await userController.search({}, res)).to.be.an('array').that.is.not.empty;
  });
});
