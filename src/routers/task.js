const express = require('express')
const Task = require('../models/task')
const validator = require('validator')
const auth = require('../middleware/auth')

const taskRouter = new express.Router()


taskRouter.post('/tasks', auth, async (req, res) => {
    try {
    const task = new Task({
        ...req.body,
        owner: req.user._id // parameter comes post-auth and verification.
    })
    const saveTask = await task.save(task)
    res.status(200).send('Task Created')
    } catch (e) {
        res.status(500).send()
    }
})


//sorting and pagination
// GET /tasks?completed=true/false
// limit skip
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}


    if (req.query.completed && (validator.isAlphanumeric(req.query.completed))) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit), //convert user input to ints
            skip: parseInt(req.query.skip), //convert user input to ints
            sort
        }
    }).execPopulate()
    res.status(200).send(req.user.tasks)
    } catch (e) {
        res.send(e)
    }

})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {

        const _id = req.params.id

        try {
            const task = await Task.findOne({_id, owner: req.user._id})

            if (!task){
                return res.status(404).send()
            }
            res.status(200).send(task)
        } catch (e) {
            res.status(500).send()
        }        
    } else {
        res.status(500).send('Input Validation Catch')
    }
})

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(500).send({error: "Invalid Operation"})
        }

        const _body = req.body
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(500).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
} else {
    res.status(500).send('Input Validation Catch')
}
})

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)){
        _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.send(500).send()
    }
    } else {
        res.status(500).send('Input Validation Catch')
    }
})

module.exports = taskRouter