const { method } = require('bluebird');

const { handleProcessError } = require('../helpers/handlers');

module.exports = (req, res, next) => {
  const bindResponsesFunctions = method(() => {
    res.success = (function success(data) {
      this.json({ status: 'success', data });
    }).bind(res);

    res.badRequest = (function badRequest(error) {
      this.status(400).json({ status: 'error', data: error.message });
    }).bind(res);

    res.notFound = (function notFound(error) {
      this.status(404).json({ status: 'error', data: error.message });
    }).bind(res);

    res.serverError = (function serverError(error) {
      this.status(500).json({ status: 'error', data: error.message });
    }).bind(res);

    return res;
  });

  return bindResponsesFunctions()
    .then(() => next())
    .catch(handleProcessError);
};
