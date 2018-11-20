const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const nock = require('nock');
require('../src/index');

before(function () {
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(sinonChai);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});
