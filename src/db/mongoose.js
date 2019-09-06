const mongoose = require('mongoose')

//https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager-api', { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true })


