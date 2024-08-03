import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT || 465,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const options = {
    from: "ting33497@gmail.com",
    to: email,
    subject: subject,
    text: message,
    html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
  };

  await transporter.sendMail(options);
};
