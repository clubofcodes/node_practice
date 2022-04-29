import "dotenv/config";

//DB related configuration object.
export const configs = {
    local: {
        environment: "local",
        port: process.env.PORT,
        db_name: process.env.DB_NAME,
    },
    cloud: {
        environment: "MongoDB Cloud",
        cluster_name: process.env.CLUSTER_NAME,
        db_name: process.env.DB_NAME,
        db_user: process.env.DB_USER,
        db_pwd: process.env.DB_PWD,
    }
};

export const schema_configs = {
    enum_val: { active: 1, inactive: 0 },
    basic_validators: { type: String, required: true, trim: true, }
}

//active/inactive enum values to use in schema.
export const enum_val = { active: 1, inactive: 0 };

//Server response status code object.
export const all_status_code = { ok: 200, bad: 400 };

/**
 * function to update data by id parameter and send response with particular msg and data.
 * @param {*} model mongodb collection schem object.
 * @param {*} id db object_id to update data.
 * @param {*} field_key name of field to update.
 * @param {*} value data to be update.
 * @param {*} res to send response with msg and data.
 * @param {*} code status code to send in response.
 * @param {*} msg specific msg to send in response.
 */
export const find_Update = (model, id, field_key, value, res, code, msg) => {

    model.findByIdAndUpdate(id, { [field_key]: value }, { new: true }, (err, data) => {
        err ? res.status(code.bad).send({ status_code: code.bad, error: err }) :
            data ?
                res.status(code.ok).send({ status_code: code.ok, message: msg.ok, data: data }) :
                res.status(code.bad).send({ status_code: code.ok, message: msg.err })
    });
}