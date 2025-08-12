import pkg from 'jsonwebtoken';
 const { verify } = pkg
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyotp: { type: String, default: '' },
    verifyotpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetotp: { type: String, default: '' },
    resetotpExpire: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
