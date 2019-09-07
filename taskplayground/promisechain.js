require('../src/db/mongoose')
const User = require('../src/models/user')

//5d5de423ad24fc4c419e49e8

// User.findByIdAndUpdate('5d728b276453bf37ec0a5358', {age:1}).then((user) => {
//     console.log(user)
//     return User.countDocuments( {age: 1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5d728b276453bf37ec0a5358', 5).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})