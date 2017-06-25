const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const mailer = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: 'postmaster@sandboxb9172d5cced94549a40420816a7c5b92.mailgun.org',
    pass: '9bf706de285c38237b1201fd6e28e355'
  }
});

mailer.use('compile', hbs({
  viewPath: 'views/email',
  extName: '.hbs'
}));

module.exports = mailer;