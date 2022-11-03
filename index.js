const express = require('express');
const cookie = require('cookie-parser')
const appError = require('./utils/appError')

const blogRoute = require('./routes/blog.route')
const userRoute = require('./routes/user.route')
// const authRoute = require('./routes/auth.route')

const globalErrorHandler = require('./controllers/error.controller')

const app = express();

app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// route use
app.use('/api/blog', blogRoute)
app.use('/api/user', userRoute)
// app.use('/auth', authRoute )



// Handle errors.
// app.use(function (err, req, res, next) {
//     console.log(err);
//     res.status(err.status || 500);
//     res.json({ error: err.message });
// });

app.all('*', ( req,res,next ) =>{
    // res.status(500).json({
    //     message: `${req.url} not found on this resource`
    // })
    return next(new appError(404, `${req.originalUrl} cannot be found in this application`))
})

app.use(globalErrorHandler)









module.exports = { app }