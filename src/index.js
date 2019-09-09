const express = require('express')
const helmet = require('helmet')
const validator = require('validator')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT || 3000

// 
app.use(express.json())
app.use(helmet())
app.use(userRouter)
app.use(taskRouter)


// app.use(express.json())

app.listen(port, "0.0.0.0", () => {
    console.log('Server up and running on port ' + port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
    // const authToken = jwt.sign({_id : 'test'}, 'thisismysig', {expiresIn: '15 minutes'})
    // console.log(authToken)

    // const verify = jwt.verify(authToken, 'thisismysig')
    // console.log(verify)
}

myFunction()