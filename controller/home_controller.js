const BigPromise = require('../middleware/bigPromise')

exports.home = BigPromise((req, res) => {
    res.status(200).json({
        success: true
    });
});

exports.homesomething = (req, res) => {
    res.status(200).json({
        success: true
    });
}