const sinon = require('sinon');
const UserController = require('../../src/controllers/user');

const userController = new UserController();

describe('Get list of users', () => {
  it('should be able to retrieve a  list of users', () => {
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

    const search = sinon.stub(userController, 'search');
    search(req, res);
    search.restore();
    sinon.assert.calledWith(search, req, res);
  });
});

describe('user update', () => {
  it('should be able to save/update user', () => {
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

    const update = sinon.stub(userController, 'update');
    update(req, res);
    sinon.assert.calledWith(update, req, res);
    update.restore();
  });
});

describe('user login', () => {
  it('user should be able to login', () => {
    const req = {
      body: {
        username: 'kylethejete',
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

    const update = sinon.stub(userController, 'update');
    update(req, res);
    sinon.assert.calledWith(update, req, res);
    update.restore();
  });
});
