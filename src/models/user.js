const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

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
            if (value.toLowerCase() === 'password'){
                throw new Error('Password cannot be \'password\'.')
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
                throw new Error('Please enter a valid email address.')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0 || value > 110){
                throw new Error('Age must be between 1 and 110')
            }
        }
    },
    tokens: [{
        authToken: {
            type: String,
            required: false
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const authToken = jwt.sign( { _id: user._id.toString() }, process.env.JWT_KEY_PRIV, {
        algorithm: 'RS256',
        expiresIn: '30 minutes'
    })
    console.log(authToken)

    user.tokens = user.tokens.concat({ authToken })
    await user.save()
    return authToken
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
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


// delete user tasks when user is removed

userSchema.pre('remove', async function (next) {
    const user = this
    
    await Task.deleteMany({owner: user._id})

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User