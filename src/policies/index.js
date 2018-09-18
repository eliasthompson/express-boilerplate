const fs = require('fs');
const path = require('path');

const policies = {};

try {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.') !== 0) && (file !== path.basename(module.filename)) && (file.slice(-3) === '.js')))
    .forEach((file) => {
      policies[file.split('.')[0]] = require(`./${file}`); // eslint-disable-line import/no-dynamic-require, global-require
    });
} catch (e) {
  console.error(e.stack); // eslint-disable-line no-console
  process.exit(1);
}

module.exports = policies;
