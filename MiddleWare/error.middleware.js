// Error handling middleware
const ErrorMiddleware = (err, req, res, next) => {
    console.error("Error stack:", err.stack);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default ErrorMiddleware;
