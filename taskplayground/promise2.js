require('../src/db/mongoose')
const Task = require('../src/models/task')

//5d5de423ad24fc4c419e49e8

// User.findByIdAndUpdate('5d728b276453bf37ec0a5358', {age:1}).then((user) => {
//     console.log(user)
//     return User.countDocuments( {age: 1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

// Task.findByIdAndRemove('5d72d7d9aa05074dd374b3a6').then((status) => {
//     console.log(status)
//     return Task.countDocuments( {completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('5d72d7e3aa05074dd374b3a7').then((result) => {
    console.log('removed', id)
}).catch((e) => {
    console.log(e)
})