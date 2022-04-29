const responseFunction = (isError, status_code, msg, data = null) =>
    isError ? { status_code, error: msg } : data ? { status_code, message: msg, data } : { status_code, message: msg }

export default responseFunction;