const nodemiler = require('nodemailer');

const sendEmail = async (options) => {
    // create a transporter
    const transporter = nodemiler.createTransport({

        //service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //Activate in gmail "less secure app" option 
    });
    //define email option
    const mailoption = {
        from: 'hamza aslam<hamzaaslam769@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html
    }
    //3 actually send the email
    await transporter.sendMail(mailoption);
};
module.exports = sendEmail;