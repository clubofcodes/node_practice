import responseFunction from "../utils/responseFunction"

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
// export const find_Update = (model, id, field_key, value, res, code, msg) => {
export const find_Update = async (model, id, updateData) => {

    //for user APIs.
    //     model.findByIdAndUpdate(id, { [field_key]: value }, { new: true, select: { password: 0 } }, (error, data) => {

    //         error ? res.status(code.bad).send(responseFunction(true, code.bad, error)) :
    //             data && res.status(code.ok).send(responseFunction(false, code.ok, msg.ok, data))

    //     })
    // .select({ password: 0 }); //Method - 2

    //for product APIs.
    // return await model.findByIdAndUpdate(id, updateData, { new: true });
}