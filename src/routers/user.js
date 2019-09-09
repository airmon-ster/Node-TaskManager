const express = require('express')
const User = require('../models/user')
const validator = require('validator')

const userRouter = new express.Router()

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const authToken = await user.generateAuthToken()
        res.send({user, authToken})
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
        res.status(400).send(e)
    }
})

userRouter.get('/users' , async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.send(e)
    }
})

userRouter.get('/users/:id', async (req, res) => {

    if (validator.isAlphanumeric(req.params.id)) {
        const _id = req.params.id
        
        try {
        const user = await User.findById(_id)
        if (!user){
            return res.send('No users by that ID')
        }
        res.send(user)
        } catch (e) {
            res.send(e)
        }

        // 
        // User.findById(_id).then((user) => {
        //     if (!user) {
        //         return res.send('User not found')
        //     }

        //     res.send(user)
        // }).catch((error) => {
        //     res.send(error)
        // })
    } else {
        console.log('input validation error')
    }
})

userRouter.patch('/users/:id', async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({error: "invalid op"})
        }

        const _id = req.params.id
        const _body = req.body
    try {
        //const user = await User.findByIdAndUpdate(_id, _body, {new: true, runValidators: true})

        const user = await User.findById(_id)
        
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        if (!user) {
            return res.send('No user')
        }

        res.send(user)
    } catch (e) {
        res.send(e)
    }
}
})

userRouter.delete('/users/:id', async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {
        _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)

        if (!user) {
            return res.status(404).send('no user')
        }
        res.send(user)
    } catch (e) {
        res.send(500).send(e)
    }
}
})
module.exports = userRouter