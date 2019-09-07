const mongoose = require('mongoose')
const validator = require('validator')


//https://mongoosejs.com/docs/validation.html
const User = mongoose.model('User', {
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
    }
})

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