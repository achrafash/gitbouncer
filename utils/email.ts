import { createTransport } from "nodemailer"

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASS),
    },
})

interface EmailProps {
    recipient: string
    subject: string
    body: string
}

export function sendEmail({ recipient, subject, body }: EmailProps) {
    // send mail with defined transport object
    return new Promise((resolve, reject) => {
        transporter.sendMail(
            {
                from: `"Achraf at Github-Bouncer" <${process.env.MAIL_USER}>`,
                to: recipient,
                subject: subject,
                text: body,
            },
            reject
        )
    })
}
