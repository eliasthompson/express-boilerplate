const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize');

const { handleProcessError } = require('../helpers/handlers');

const db = {
  Sequelize,
  sequelize: new Sequelize({
    dialect: 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || 'postgres',
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    // logging: false,
  }),
};

try {
  fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.') !== 0) && (file !== path.basename(module.filename)) && (file.slice(-3) === '.js')))
    .forEach((file) => {
      const modelDef = db.sequelize.import(path.join(__dirname, file));
      const modelName = _.camelCase(modelDef.model.name).substr(0, 1).toUpperCase() + _.camelCase(modelDef.model.name).substr(1);
      db[modelName] = modelDef;
    });

  _.each(_.keys(db), (modelName) => {
    if (_.has(db[modelName], 'model.associate')) {
      db[modelName].model.associate(db);
    }
  });
} catch (e) {
  handleProcessError(e);
}

db.sequelize
  .authenticate()
  .catch(handleProcessError);

module.exports = db;
