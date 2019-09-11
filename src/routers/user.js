const express = require('express')
const User = require('../models/user')
const validator = require('validator')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancelEmail } = require('../emails/account')


const userRouter = new express.Router()

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    if (validator.isEmail(user.email) && validator.isAlphanumeric(user.name)){

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const authToken = await user.generateAuthToken()
        res.status(201).send({user, authToken})
    } catch (e) {
        res.send(e)
    }
} else {
    res.status(500).send('Input Validation Catch')
}
})


userRouter.post('/users/login', async (req, res) => {
    if (validator.isEmail(req.body.email)) { //add more regex filtering for password injection
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const authToken = await user.generateAuthToken()
        res.status(200).send({user, authToken}) /////change to welcome message. Dont sent auth details
    } catch (e) {
        res.status(400).send()
    }
} else {
    res.status(500).send('Input Validation Catch')
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



userRouter.patch('/users/me', auth, async (req, res) => {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({error: "Invalid Operation"})
        }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.send(e)
    }

})

userRouter.delete('/users/me', auth, async (req, res) => {
    try {
        cancelEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }

})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:100, height:100}).png().toBuffer()
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
        if (validator.isAlphanumeric(req.params.id)){
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
    } else {
        res.status(500).send('Input Validation Catch')
    }
    })
    //
module.exports = userRouter