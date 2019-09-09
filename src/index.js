const express = require('express')
const helmet = require('helmet')
const validator = require('validator')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT || 3000

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

