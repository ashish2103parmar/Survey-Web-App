/**
 * Custom Exception
 */

exports.CustomException = (code, msg) => ({ code, msg })

exports.CustomExceptionCodes = {
    UnknownError: "UnknownError",
    AlreadyExists: "AlreadyExists",
    InvalidRequest: "InvalidRequest",
}