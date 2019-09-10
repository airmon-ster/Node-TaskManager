const express = require('express')
const User = require('../models/user')
const validator = require('validator')
const auth = require('../middleware/auth')
const multer = require('multer')


const userRouter = new express.Router()

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
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

        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.send(500).send(e)
    }

})



// const upload =  multer({
//     dest: 'images/'
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

const upload = multer({
    dest: 'avatars/',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.pdf')) {
            return cb(new Error('Please upload a .pdf'))
        }
        cb(undefined)
        // cb(new Error('Incompatible file type'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

userRouter.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
    })
module.exports = userRouter