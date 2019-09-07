const express = require('express')
const Task = require('../models/task')

const taskRouter = new express.Router()


taskRouter.post('/tasks', async (req, res) => {
    try {
    const task = await new Task(req.body)
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

taskRouter.get('/tasks', async (req, res) => {

    try {
    const finder = await Task.find( {})
    res.send(finder)
    } catch (e) {
        res.send(e)
    }
    // Task.find( {} ).then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.send(e)
    // })
})

taskRouter.get('/tasks/:id' , async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {
        const _id = req.params.id

        try {
            const taskFind = await Task.findById(_id)
            if (!taskFind){
                return res.send('Task not found')
            }
            res.send(taskFind)
        } catch (e) {
            res.send(e)
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
        else {
            console.log('input validation error')
        }
    }
)

taskRouter.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findByIdAndUpdate(_id, _body, {new: true, runValidators: true})

        if (!task) {
            return res.send('No task')
        }

        res.send(task)
    } catch (e) {
        res.send(e)
    }
}
})

taskRouter.delete('/tasks/:id', async (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {
        _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)

        if (!task) {
            return res.status(404).send('no task')
        }
        res.send(task)
    } catch (e) {
        res.send(500).send(e)
    }
}
})

module.exports = taskRouter