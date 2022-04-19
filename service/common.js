/**
 * function to update data.
 * @param {*} model mongodb collection schem object.
 * @param {*} id db object_id to update data.
 * @param {*} field_key name of field to update.
 * @param {*} value data to be update.
 * @param {*} res to send response with msg and data.
 * @param {*} code status code to send in response.
 * @param {*} msg specific msg to send in response.
 * Author: Rahul Jagetia
 */
 export const find_Update = (model, id, field_key, value, res, code, msg) => {

    model.findByIdAndUpdate(id, { [field_key]: value }, { new: true }, (err, data) => {
        err ? res.status(code.bad).send({ status_code: code.bad, error: err }) :
            data ?
                res.status(code.ok).send({ status_code: code.ok, message: msg.ok, data: data }) :
                res.status(code.bad).send({ status_code: code.ok, message: msg.err })
    });
}