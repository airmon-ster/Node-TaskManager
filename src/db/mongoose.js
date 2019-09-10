const mongoose = require('mongoose')

//https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac

mongoose.connect(process.env.MONGODB_URL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true ,
    useFindAndModify: false})


