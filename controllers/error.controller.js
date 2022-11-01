const appError = require('../utils/appError')


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode //or 500
    err.status = err.status //or 'Server Error'
    // console.log(err)
    let error = { ...err }
    return next()
}