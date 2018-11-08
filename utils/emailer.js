const config = require('config');

const emailConfig = config.get('development.email');

const httpLogger = require('./logger');
const nodemailer = require('nodemailer');
/**
 * Send email.
 * @param {*} mailOptions
 *
 * @return {object} Promise
 */
function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: emailConfig.auth.user,
      pass: emailConfig.auth.password,
    },
  });

  return transporter.sendMail(mailOptions).then((result) => {
    httpLogger.info('Message sent: %s', result.accepted[0]);
    return { success: true };
  }).catch((error) => {
    httpLogger.info(error);
    return {
      errors: [{
        msg: 'Unable to make request - contant your system admin.',
      }],
    };
  });
}

module.exports = sendEmail;
