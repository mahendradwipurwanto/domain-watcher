// Middleware to check the secret token
async function checkSecretToken(req, res, next) {
    const secret = req.headers['x-secret-token'];
    if (secret !== process.env.SECRET_TOKEN) {
        return res.status(401)
            .json({
                status: "Failed",
                message: "Unauthorized"
            });
    }
    next();
}

module.exports = { checkSecretToken };