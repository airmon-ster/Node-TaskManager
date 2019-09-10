const express = require('express')
const Task = require('../models/task')
const validator = require('validator')
const auth = require('../middleware/auth')

const taskRouter = new express.Router()


taskRouter.post('/tasks', auth, async (req, res) => {
    try {
    //const task = await new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    const saveTask = await task.save(task)
    res.send(task)
    } catch (e) {
        res.send(e)
    }
    // const task = new Task(req.body)
    // task.save(task).then(() => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// GET /tasks?completed=true/false
// limit skip
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
    // const finder = await Task.find({})
    //const finder = await Task.find({owner: req.user._id})
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.status(200).send(req.user.tasks)
    } catch (e) {
        res.send(e)
    }
    // Task.find( {} ).then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.send(e)
    // })
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {

        const _id = req.params.id

        try {
            //const taskFind = await Task.findById(_id)
            const task = await Task.findOne({_id, owner: req.user._id})

            if (!task){
                return res.status(404).send()
            }
            res.send(task)
        } catch (e) {
            res.status(500).send()
        }
        // Task.findById(_id).then((task) => {
        //     if (!task) {
        //         return req.send('Task not found')
        //     }
        //     res.send(task)
        // }).catch((e) => {
        //     res.send(e)
        // })
        
    }
)

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {

        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({error: "invalid op"})
        }

        const _id = req.params.id
        const _body = req.body
    try {
        //const task = await Task.findByIdAndUpdate(_id, _body, {new: true, runValidators: true})

        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if (!task) {
            return res.status(400).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.send(e)
    }
}
})

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
        _id = req.params.id
    try {
        //const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.send(500).send(e)
    }

})

module.exports = taskRouter