const express = require('express')
const User = require('../models/user')
const validator = require('validator')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancelEmail} = require('../emails/account')


const userRouter = new express.Router()

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const authToken = await user.generateAuthToken()
        res.status(201).send({user, authToken})
    } catch (e) {
        res.send(e)
    }
})
//     user.save(user).then(() => {
//         res.send(user)
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const authToken = await user.generateAuthToken()
        res.status(200).send({user, authToken})
    } catch (e) {
        res.status(400).send()
    }
})


userRouter.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.status(200).send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})

userRouter.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((authToken) => {
            return authToken.authToken !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }

})

userRouter.get('/users/me' , auth, async (req, res) => {
    res.send(req.user)
})

// userRouter.get('/users/:id', async (req, res) => {

//     if (validator.isAlphanumeric(req.params.id)) {
//         const _id = req.params.id
        
//         try {
//         const user = await User.findById(_id)
//         if (!user){
//             return res.send('No users by that ID')
//         }
//         res.send(user)
//         } catch (e) {
//             res.send(e)
//         }

//         // 
//         // User.findById(_id).then((user) => {
//         //     if (!user) {
//         //         return res.send('User not found')
//         //     }

//         //     res.send(user)
//         // }).catch((error) => {
//         //     res.send(error)
//         // })
//     } else {
//         console.log('input validation error')
//     }
// })

userRouter.patch('/users/me', auth, async (req, res) => {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({error: "invalid op"})
        }

        // const _id = req.params.id
        // const _body = req.body
    try {
        //const user = await User.findByIdAndUpdate(_id, _body, {new: true, runValidators: true})

        // const user = await User.findById(_id)
        
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // if (!user) {
        //     return res.send('No user')
        // }

        res.send(req.user)
    } catch (e) {
        res.send(e)
    }

})

userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(_id)

        // if (!user) {
        //     return res.status(404).send('no user')
        // }

        cancelEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }

})



// const upload =  multer({
//     dest: 'images/'
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
        // cb(new Error('Incompatible file type'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    }, (error, req, res, next) => {
        res.status(400).send({error: error.message})
    })

    userRouter.delete('/users/me/avatar', auth, async (req, res) => {
        req.user.avatar = []
        await req.user.save()
        res.status(200).send()
    })

    userRouter.get('/users/:id/avatar', async (req, res) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user || !user.avatar) {
                throw new Error()
            }

            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        } catch (e) {
            res.status(404).send()
        }
    })
    //
module.exports = userRouter