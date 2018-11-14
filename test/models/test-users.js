const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../../src/models');

const { User } = db;

describe('User functionality', () => {
  it('should be a model object', () => {
    sinon.stub(User.model, 'findAll');
    sinon.stub(User.model, 'findOne');
    sinon.stub(User.model, 'update');

    expect(User.model);
  });
});
