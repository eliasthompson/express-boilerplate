const winston = require('winston');

module.exports = {
  getLogger(options) {
    return winston.createLogger({
      level: options.level,
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: options.filePath,
          level: options.level,
        }),
      ],
    });
  },
};
