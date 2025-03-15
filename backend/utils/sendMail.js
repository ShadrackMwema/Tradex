const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    // Hardcoded configuration for testing purposes
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'euginekoyo003@gmail.com',
        pass: 'sbga zdsz uvtn mjqe',
      },
      debug: true, // Enable debug output
    });

    const mailOptions = {
      from: 'euginekoyo003@gmail.com',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    console.log(`Attempting to send email to: ${options.email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error in sendMail function:", error);
    throw error;
  }
};

module.exports = sendMail;