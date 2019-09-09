const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if (value === 'password'){
                throw new Error('Password cannot be \'password\' ')
            }
        }

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Not an email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0){
                throw new Error('Age must be greater than 0')
            }
        }
    },
    tokens: [{
        authToken: {
            type: String,
            required: false
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const authToken = jwt.sign( { _id: user._id.toString() }, 'secretpassphrase')

    user.tokens = user.tokens.concat({ authToken })
    await user.save()
    return authToken
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user
}

//hash password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


//https://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', userSchema)

// const me = new User({
//     email: 'test@test.com',
//     password: 'pass',
//     name: 'random',
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })



module.exports = User