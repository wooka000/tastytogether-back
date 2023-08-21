module.exports = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res);
    } catch (err) {
        next(err);
    }
};
