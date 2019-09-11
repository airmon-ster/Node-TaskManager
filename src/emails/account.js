const sgmail = require('@sendgrid/mail')


sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'stewart@secoverflow.io',
        subject: 'Welcome to SecOverflown.io!',
        text: `Welcome to the app, ${name}!. This is a test welcome email that will be sent out to users as they register with the service.`
    })
}

const cancelEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'stsummers2008@gmail.com',
        subject: 'Come back soon!',
        text: `Goodbye for now, ${name}. We are sorry to see you go, but hope that you consider us for any future security needs that you may have in the future!`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}