import nodemailer from 'nodemailer';
dotenv.config(); // make sure .env is loaded
import dotenv from "dotenv";

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_pass,
    }
});

export default transporter;
