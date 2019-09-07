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

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.send(user)
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

app.get('/users' , async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.send(e)
    }
})

app.get('/users/:id', async (req, res) => {

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

app.post('/tasks', async (req, res) => {
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

app.get('/tasks', async (req, res) => {

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

app.get('/tasks/:id' , async (req, res) => {
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





app.listen(port, "0.0.0.0", () => {
    console.log('Server up and running on port ' + port)
})

//test