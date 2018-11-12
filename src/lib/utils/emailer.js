const nodemailer = require('nodemailer');
const httpLogger = require('./logger');

/**
 * Send email.
 * @param {*} mailOptions
 *
 * @return {object} Promise
 */
module.exports = {
  sendEmail(mailOptions) {
    const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });

    return transporter.sendMail(mailOptions).then((result) => {
      httpLogger.info('Message sent: %s', result.accepted[0]);
      return { success: true };
    }).catch((error) => {
      httpLogger.info(error);
      return {
        errors: [{
          msg: 'Unable to make request - contact your system admin.',
        }],
      };
    });
  },
};
