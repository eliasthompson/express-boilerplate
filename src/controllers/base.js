const _ = require('lodash');
const { NotFoundError } = require('common-errors');

module.exports = class BaseController {
  /**
   * This method checks if the record exists amd throws a NotFoundError it doesn't.
   * @param {object} record - database record
   * @throws {NotFoundError} throws an error
   * @returns {object} returns the record
   */
  exists(record) {
    if (_.isEmpty(record)) throw new NotFoundError('Record does not exist.');
    return record;
  }

  /**
   * This method logs the output and throws the data.
   * @param data - supplied data
   * @throws supplied data
   */
  logAndThrow(data) {
    console.error(data); // eslint-disable-line no-console
    throw data;
  }

  /**
   * This method logs the output and returns the data.
   * @param data - supplied data
   * @returns supplied data
   */
  logAndReturn(data) {
    console.log(data); // eslint-disable-line no-console
    return data;
  }
};
