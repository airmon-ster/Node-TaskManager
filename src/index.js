const express = require('express')
const helmet = require('helmet')
const validator = require('validator')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT

// file upload to express

// const multer = require('multer')
// const upload =  multer({
//     dest: 'images/'
// })

// const middlewareError = (req, res, next) => {
//     throw new Error('middleware error')
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })


// middleware

// app.use((req, res, next) => {
//     res.status(503).send('Site is under construction')
// })

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests disabled')
//     } else {
//         next()
//     }
// })

// 
app.use(express.json())
app.use(helmet())
app.use(userRouter)
app.use(taskRouter)


// app.use(express.json())

app.listen(port, "0.0.0.0", () => {
    console.log('Server up and running on port ' + port)
})


// const Task =  require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5d75dda0af292202b005b372')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5d75dc8d508805348022a98f')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()