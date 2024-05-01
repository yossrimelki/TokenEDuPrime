// Import necessary modules
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Function to generate a random string for the reset token
const generateResetToken = () => {
  const tokenLength = 20;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};
// Create a transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service provider
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'cawael09@gmail.com', // Your Gmail email address
    pass: 'rhsk uruo fxym nqlf' // Your Gmail password or an app-specific password
  }
});

// Function to generate a random 4-character code
const generateVerificationCode = () => {
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { fName, email, phoneNumber, password } = req.body;

    // Check if the user with the provided email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    // Create a new user
    const newUser = new User({
      fName,
      email,
      phoneNumber,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ etatDelete: false }); // Exclude deleted users

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fName, email, phoneNumber, score } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.fName = fName || user.fName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.score = score || user.score;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a user by ID (soft delete)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete the user by setting etatDelete to true
    user.etatDelete = true;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Send reset password email with verification code
const sendResetEmail = async (email, resetToken) => {
  try {
    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Save the verification code in the user's document
    const user = await User.findOneAndUpdate({ email }, { verificationCode });

    // Construct email content with verification code
    const mailOptions = {
      from: 'cawael09@gmail.com',
      to: email,
      subject: 'Password Reset Verification Code',
      html: `<p>Your verification code for password reset is: <strong>${verificationCode}</strong>. Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}">here</a> to reset your password.</p>`
    };

    // Send email using nodemailer transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique reset token
    const resetToken = generateResetToken();

    // Save the reset token with the user's email in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send reset email with verification code
    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    // Find the user by email and verify the reset token
    const user = await User.findOne({ email });

    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, requestPasswordReset, resetPassword };
