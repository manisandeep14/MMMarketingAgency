// import nodemailer from 'nodemailer';

// const createTransporter = () => {
//   if (process.env.SMTP_USER && process.env.SMTP_PASS) {
//     return nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: process.env.SMTP_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//   }

//   console.warn('SMTP credentials not configured. Email services will not work.');
//   return null;
// };

// export const sendEmail = async (options) => {
//   const transporter = createTransporter();

//   if (!transporter) {
//     console.error('Email transporter not configured');
//     return false;
//   }

//   const mailOptions = {
//     from: process.env.SMTP_FROM || process.env.SMTP_USER,
//     to: options.to,
//     subject: options.subject,
//     html: options.html,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully to:', options.to);
//     return true;
//   } catch (error) {
//     console.error('Error sending email:', error.message);
//     return false;
//   }
// };
