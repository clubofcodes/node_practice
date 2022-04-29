import "dotenv/config";

//DB related configuration object.
export const configs = {
    local: {
        environment: "local",
        port: process.env.PORT,
        db_name: process.env.DB_NAME,
    },
    staging: {
        environment: "MongoDB Cloud",
        cluster_name: process.env.CLUSTER_NAME,
        db_name: process.env.DB_NAME,
        db_user: process.env.DB_USER,
        db_pwd: process.env.DB_PWD,
    }
};

//schema related configuration object.
export const schema_configs = {
    enum_val: { active: 1, inactive: 0 }, //active/inactive enum values to use in schema.
    basic_validators: { type: String, required: true, trim: true, }
}

//Server response status code object.
export const status_codes = { ok: 200, bad: 400, auth: 401 };

//Secret string for jwt.
export const JWT_KEY = process.env.SECRET_KEY;

//Settings to send messages directly from your email client or mail transfer agent.
//SMTP (Simple Mail Transfer Protocol) is used to send emails between various servers over internet.
//SMTP Server - 1 (Dummy mail testing server/add-on)
export const mailtrap_configs = {
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER, // generated ethereal user.
        pass: process.env.MAIL_PWD // generated ethereal password.
    }
}

//SMTP Server - 2 (Via google gmail server)
export const gmail_configs = {
    host: "smtp.gmail.com", //it’s an IP address/hostname for connecting to (by default to ‘localhost’)
    port: 465, //465 is for only secure true.
    secure: true, //if secure is false port uses 587 by default, and 465 if true.
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PWD
    }
}

export const from_mail_id = process.env.GMAIL_USER;