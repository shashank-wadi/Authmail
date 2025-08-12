import express from 'express';
import { register, login, logout, sendverifyOtp, verifyEmail, isAuthenticated, sendRestOtp, resetPassword ,verifyOtp} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Register Routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendverifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendRestOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/verify-otp', verifyOtp); // Add this line for OTP verification

export default authRouter;
