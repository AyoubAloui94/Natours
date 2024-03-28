/* eslint-disable */
const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

const { MailerSend, Recipient, EmailParams, Sender } = require('mailersend');

module.exports = class Email {
  // prettier-ignore
  constructor(user, url) {
    this.to = user.email,
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ayoub Aloui ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // return nodemailer.createTransport({
    //   service: 'SendGrid',
    //   host: 'smtp.sendgrid.net',
    //   port: 465,
    //   auth: {
    //     user: process.env.SENDGRID_USERNAME,
    //     pass: process.env.SENDGRID_PASSWORD,
    //   },
    // });
  }

  // send the actual email
  async send(template, subject) {
    // Render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    if (process.env.NODE_ENV === 'development') {
      // define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      // create transport and send email

      await this.newTransport().sendMail(mailOptions);
    } else {
      const mailersend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
      });

      const sentFrom = new Sender(process.env.MAILERSEND_USERNAME, 'natours');

      const recipients = [new Recipient(this.to, 'test')];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(subject)
        .setHtml(html)
        .setText(htmlToText(html));

      await mailersend.email.send(emailParams);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
};
