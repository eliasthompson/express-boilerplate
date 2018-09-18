const { method } = require('bluebird');

module.exports = (req, res, next) => {
  const bindResponsesFunctions = method(() => {
    res.success = (function success(data) {
      this.json({ status: 'success', data });
    }).bind(res);

    res.badRequest = (function badRequest(error) {
      this.status(400).json({ status: 'error', data: error.message });
    }).bind(res);

    res.serverError = (function serverError(error) {
      this.status(500).json({ status: 'error', data: error.message });
    }).bind(res);
  });

  return bindResponsesFunctions()
    .then(() => next())
    .catch((err) => {
      console.error('Unable to bind response functions: ', err); // eslint-disable-line no-console
      process.exit(1);
    });
};
