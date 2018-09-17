const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);

const db = {
  Sequelize,
  sequelize: new Sequelize(
    process.env.PG_DATABASE || 'postgres',
    process.env.PG_USERNAME || 'postgres',
    process.env.PG_PASSWORD || 'postgres',
    {
      dialect: 'postgres',
      host: process.env.PG_HOST || 'localhost',
    },
  ),
};

function handleErrors(err) {
  console.error(err.stack); // eslint-disable-line no-console
  process.exit(1);
}

try {
  // Read model definitions from the models dir
  fs.readdirSync(__dirname)
    .filter(file => ((file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')))
    .forEach((file) => {
      const modelDef = db.sequelize.import(path.join(__dirname, file));
      const modelName = _.camelCase(modelDef.model.name).substr(0, 1).toUpperCase() + _.camelCase(modelDef.model.name).substr(1);
      db[modelName] = modelDef;
    });

  // Bind associations
  _.each(_.keys(db), (modelName) => {
    if (_.has(db[modelName], 'model.associate')) {
      db[modelName].model.associate(db);
    }
  });
} catch (e) {
  handleErrors(e);
}

// console.log(db);

db.sequelize
  .authenticate()
  .catch(handleErrors);

module.exports = db;
