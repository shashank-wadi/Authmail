import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    
    try {
      const mailOptions = {
        from: process.env.SENDER_EMAIL || process.env.sender_email, 
        to: email,
        subject: "Welcome To My MERN-Website",
        text: `Welcome to MERN-Website. Your account has been created with the email id: ${email}`,
      };
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      
      console.error("Welcome email failed:", mailErr?.message || mailErr);
    }

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, Message: "Logged out" });
  } catch (error) {
    
  }
};
export const sendverifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.sender_email,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Please verify your account.`,
    });

    res.json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const token = req.cookies.token; 

  if (!token) {
    return res.json({ success: false, message: "Not logged in" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!otp) {
      return res.json({ success: false, message: "Missing OTP" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyotp || String(user.verifyotp) !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyotpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }


    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendRestOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 90000));
    user.resetotp = otp;
    user.resetotpExpire = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    const mailOption = {
      from: process.env.sender_email,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. Use this OTP to reset your password.`,
    };
    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "Password reset OTP sent to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetotpExpire < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and NewPassword are requird",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetotpExpire < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetotp = "";
    user.resetotpExpire = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
