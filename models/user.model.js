const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const objectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Please input your email']
    },
    first_name: {
        type: String,
        required: [true, 'Please input your first name']
    },
    last_name: {
        type: String,
        required: [true, 'Please input your last name']
    },
    // passwordHash: {
    //     type: String
    // },
    password: {
        type: String,
        required: [true, 'Please set a password'],
        minlength: 8,
        // select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password'],
        minlength: 8,
    },
    // blogs: [
    //     {
    //         type: objectId,
    //         ref: 'Blog'
    //     }
    // ],
})


userSchema.pre(
    'save',
    async function (next) {
        if(!this.isModified('password'))  next();
        this.password = await bcrypt.hash(this.password, 12)
        this.passwordConfirm = undefined
        next()
    }
)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
        // delete returnedObject.token
    }
})



const userModel = mongoose.model('User', userSchema)

module.exports = userModel