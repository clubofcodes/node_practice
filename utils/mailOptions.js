import { from_mail_id } from "../config";

/**
 * Styling html code for email body.
 * @returns html view with subject, fullname, message email body design.
 */
const mailContent = (mail_sub, mail_greet, first_name, last_name, mail_msg) => `<html>
                    <head>
                    <title>Registered Successfully</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    </head>
                    <body bgcolor="#f1f3f6">
                    <table border="0" cellpadding="0" cellspacing="0" style="max-width: 602px;width: 100%;border: 1px solid #d2a813 !important; box-shadow: 0px 0px 12px -5px #d2a813 !important; font-family: Poppins, Helvetica, Arial, sans-serif !important;" align="center">
                    <tr>
                        <td align="center" valign="middle" bgcolor="#d2a813" style="border: 1px solid #d2a813 !important; box-shadow: 0px 0px 12px -5px #d2a813 !important;">
                        <h2 style="color:black;">${mail_sub}</h2>
                        </td>
                    </tr>
                    
                    <tr>
                        <td valign="top" align="middle">
                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;background-color: #fff !important;padding: 10px; text-align: center;">
                                <tr>
                                    <td style="display: inline-block;max-width:450px;width: 100%" align="left">
                                    <p style="margin: 1rem 0 1.2rem; font-size:18px; font-weight: 400; color:#212529;">${mail_greet} ${first_name} ${last_name},</p>
                                    <p style="margin:0; margin-bottom:0.75rem; font-weight: 500; font-size:20px; color:#212529!important;">Hello There!, Welcome to world of Nodejs APIs!</p>
                                    <p style="margin:0; margin-bottom:5px; font-weight: 400; font-size:18px; color:#212529!important;">Note: <span style="font-size:16px;">${mail_msg}</span></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    </table>
                    </body>
                    </html>`;

/**
 * @param {*} to_email // single or list of recipents.
 * @param {*} mail_sub // mail subject text.
 * @param {*} mail_greet // starting greeting of mail (i.e., Dear, respected, etc.) text.
 * @param {*} first_name // first name of recipient.
 * @param {*} last_name // last name of recipient.
 * @param {*} mail_msg // email body/content/msg.
 * @returns an object of basic mail fields/options that required to send mail.
 */
const mailOptions = (to_email, mail_sub, mail_greet, first_name, last_name, mail_msg) => {

    return {
        from: from_mail_id, // Sender address
        to: to_email, // List of recipients
        subject: mail_sub, // Subject line
        // text: mail_msg + ` ${first_name} ${last_name},`, // Plain text body
        html: mailContent(mail_sub, mail_greet, first_name, last_name, mail_msg),
        attachments: [
            {
                filename: 'Today\'s Note.jpg',
                path: './Today\'s Note.jpg',
                // contentType: 'multipart/mixed'
            }
        ]
    }
}

export default mailOptions;