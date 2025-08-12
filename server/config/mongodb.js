import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import xoauth2 from 'nodemailer/lib/xoauth2/index.js'; 

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("✅ Database is connected"));


    await mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

export default connectDB;
