require('dotenv').config(); 
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
async function send_email(options) {
 
  options.subject="Kutiza Website - "+options.subject

  try {
    const source = fs.readFileSync(path.join(__dirname, `../templates/${options.template}.html`), 'utf-8').toString();
    const template = handlebars.compile(source);
    const html = template(options.data);

    await main({ title: options.title, to: options.to, subject: options.subject, html,user_settings: options.user_settings,template:options.template,attachments:options.attachments });
 } catch (error) {
    console.error("Error sending email:", error);
  }
}


async function main(options) {
  try {
    let { to, subject, html, title,attachments } = options;
    
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port:  process.env.MAIL_PORT, 
      secure: false,
      auth: {
        user:  process.env.MAIL_USERNAME, 
        pass:  process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let email_list=[to ? to : process.env.MAIL_USERNAME]

    if(process.env.MAIL_USERNAME==to || !to || options.send_to_admin){
       //email_list.push(process.env.ADMIN_USER)
       //email_list.push('derciorosario55@gmail.com')
    }


    if(!email_list.length) return

    const info = await transporter.sendMail({
      from: `"${title}" <${process.env.MAIL_USERNAME}>`, 
      to: email_list,
      subject,
      html,
      attachments:attachments || []
    });

    console.log("Message sent: %s", info.accepted);
  } catch (error) {
    console.error("Error in sending mail:", error);
    throw error; 
  }
}

module.exports = { send_email };
