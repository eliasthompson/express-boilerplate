const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const nock = require('nock');

before(function () {
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(sinonChai);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});
