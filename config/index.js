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