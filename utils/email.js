const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define the email options
  const mailOptions = {
    from: "abdurrahman issalim <abodesalm45@gmail.com>",
    to: options.to,
    supject: options.supject,
    text: options.message,
    // html:
  };

  //3)Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
