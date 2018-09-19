const fs = require('fs');
const path = require('path');

const { handleProcessError } = require('../helpers/handlers');

const policies = {};

try {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.') !== 0) && (file !== path.basename(module.filename)) && (file.slice(-3) === '.js')))
    .forEach((file) => {
      policies[file.split('.')[0]] = require(`./${file}`); // eslint-disable-line import/no-dynamic-require, global-require
    });
} catch (e) {
  handleProcessError(e);
}

module.exports = policies;
