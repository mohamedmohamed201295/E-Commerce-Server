import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const mailOpts = {
    from: 'E-shop App <strugglermoo@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOpts)
}

export default sendEmail
