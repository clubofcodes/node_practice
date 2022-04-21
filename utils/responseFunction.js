const responseFunction = (isError, status_code, msg, data = null) =>
    isError ? { status_code, error: msg } : { status_code, message: msg, data }

export default responseFunction;