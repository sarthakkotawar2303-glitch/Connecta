/**
 * @fileoverview Centralised global error interception and routing middleware.
 * Catches unhandled exceptions, sanitises system stack traces, and transforms Multer stream errors.
 * @module middleware/errorMiddleware
 */

/**
 * Fallback routing interception gate. Captures requests matching zero active server endpoint routes,
 * generates a structured 404 Error object instance, and pipes execution down to the global exception logger.
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - [${req.method}] ${req.originalUrl}`);
    res.status(404);
    next(error);
};


const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.message === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "File upload rejected. Maximum allowance threshold constraint is 5MB.";
    } else if (err.message === "LIMIT_UNSUPPORTED_FILE_TYPE") {
        statusCode = 400;
        message = "File upload rejected. Invalid media structure detected; please upload images only.";
    }

    res.status(statusCode);
    return res.json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler
};
