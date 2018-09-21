const { method } = require('bluebird');

const { handleProcessError } = require('../lib/handlers');

module.exports = (req, res, next) => {
  const validateRequest = method(() => {
    req.user = { test: true };
    return req.user;
  });

  return validateRequest()
    .then(() => next())
    .catch(handleProcessError);
};
