const express = require('express')
const helmet = require('helmet')
const validator = require('validator')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')


const app = express()
const port = process.env.PORT || 3000

// app.use(helmet())
app.use(express.json(), helmet())

// app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save(user).then(() => {
        res.send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users' , (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.send(error)
    })
})

app.get('/users/:id', (req, res) => {

    if (validator.isAlphanumeric(req.params.id)) {
        const _id = req.params.id
        User.findById(_id).then((user) => {
            if (!user) {
                return res.send('User not found')
            }

            res.send(user)
        }).catch((error) => {
            res.send(error)
        })
    } else {
        console.log('input validation error')
    }
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save(task).then(() => {
        res.send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/tasks', (req, res) => {
    Task.find( {} ).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.send(e)
    })
})

app.get('/tasks/:id' , (req, res) => {
    if (validator.isAlphanumeric(req.params.id)) {
        const _id = req.params.id
        Task.findById(_id).then((task) => {
            if (!task) {
                return req.send('Task not found')
            }
            res.send(task)
        }).catch((e) => {
            res.send(e)
        })
        }
        else {
            console.log('input validation error')
        }
    }
)





app.listen(port, "0.0.0.0", () => {
    console.log('Server up and running on port ' + port)
})