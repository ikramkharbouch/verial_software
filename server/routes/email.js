const nodemailer = require('nodemailer');
const multer = require('multer');
const express = require('express');

const router = express.Router();
const upload = multer();

router.post("/send-email", upload.single("pdf"), async (req, res) => {
    const { recipient, subject, message } = req.body;
    const pdf = req.file;

    // Nodemailer setup (replace with your email provider's configuration)
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-password",
        },
    });

    try {
        await transporter.sendMail({
            from: "your-email@gmail.com",
            to: recipient,
            subject: subject,
            text: message,
            attachments: [
                {
                    filename: "sales_report.pdf",
                    content: pdf.buffer,
                },
            ],
        });

        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email");
    }
});

module.exports = router;