const sgmail = require('@sendgrid/mail')


sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'stsummers2008@gmail.com',
        subject: 'Welcome',
        text: `Welcome to the app, ${name}. Howdy!`
    })
}

const cancelEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'stsummers2008@gmail.com',
        subject: 'Goodbye',
        text: `Goodbye, ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelEmail
}