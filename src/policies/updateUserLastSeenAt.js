const { method } = require('bluebird');

const { handleProcessError } = require('../helpers/handlers');

module.exports = (req, res, next) => {
  const updateUserLastSeenAt = method(() => {
    console.log('i   s e e   y o u');

    return 'something later';
  });

  return updateUserLastSeenAt()
    .then(() => next())
    .catch(handleProcessError);
};
