import { createTransport, getTestMessageUrl } from "nodemailer";
import { gmail_configs, mailtrap_configs } from "../config";

/**
 * created reusable send mail object using the default SMTP transport
 * @param {*} mailOptions contains from, to, subject, text/html, attachments array.
 * @returns information realeted to mail sent.
 * Author: Rahul Jagetia
 */
const sendAMail = async (mailOptions) => {
    // console.log(mailOptions);
    //gmail_configs/mailtrap_configs => is the transport configuration object, connection url or a transport plugin instance.
    const transport = createTransport(mailtrap_configs); // is going to be an object that is able to send mail.
    const info = await transport.sendMail(mailOptions); // sends an email, similar to mail() function of PHP.
    // console.log(info);
    return info;
};

export default sendAMail;