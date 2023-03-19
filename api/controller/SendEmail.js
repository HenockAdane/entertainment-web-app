const nodemailer = require ("nodemailer")


const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    },
})


const sendEmail = async (to,subject,html)=> {
    try {
        let info = await transporter.sendMail({
            from: `<${process.env.USER}>`,
            to: to,
            subject: subject,
            html: html
        })
    
        return info
    } catch(error){
        console.log("error for nodemailer")
        console.log(error)
    }
}

module.exports = sendEmail