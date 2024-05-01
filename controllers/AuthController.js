const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const admin = require('firebase-admin');
const { verifyToken } = require('../middleware/verifyToken'); // Import the verifyToken middleware
const ethers = require('ethers');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('../pim2024-868e6-firebase-adminsdk-jwrc1-85f6aa24a2.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to sign up a user with email and password
const signUpWithEmailPassword = async (email, password) => {
  const userRecord = await admin.auth().createUser({
    email: email,
    password: password
  });
  return userRecord.uid;
};

// Function to sign in a user with email and password
const signInWithEmailPassword = async (email, password) => {
  const userRecord = await admin.auth().getUserByEmail(email);
  return userRecord.uid;
};

// Function to sign in a user with Google OAuth token
const signInWithGoogleToken = async (idToken) => {
  const credential = admin.auth.GoogleAuthProvider.credential(idToken);
  const userRecord = await admin.auth().signInWithCredential(credential);
  return userRecord.uid;
};

// Function to sign in a user with Facebook OAuth token
const signInWithFacebookToken = async (accessToken) => {
  const credential = admin.auth.FacebookAuthProvider.credential(accessToken);
  const userRecord = await admin.auth().signInWithCredential(credential);
  return userRecord.uid;
};

const register = async (req, res) => {
  try {
    const { fName, email, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    // Register user with email and password
    const uid = await signUpWithEmailPassword(email, password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = ethers.Wallet.createRandom();
    const newUser = new User({
      fName,
      email,
      phoneNumber, 
      password: hashedPassword,
      AddWalet: wallet.address,
      pkeyWalet: wallet.privateKey,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', uid: uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sign in user with email and password
    const uid = await signInWithEmailPassword(email, password);
    res.status(200).json({ uid: uid, message: 'User signed in with email and password successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  try {
    // Sign in user with Google OAuth token
    const uid = await signInWithGoogleToken(idToken);
    res.status(200).json({ uid: uid, message: 'User signed in with Google successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginWithFacebook = async (req, res) => {
  const { accessToken } = req.body;
  try {
    // Sign in user with Facebook OAuth token
    const uid = await signInWithFacebookToken(accessToken);
    res.status(200).json({ uid: uid, message: 'User signed in with Facebook successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { 
  register, 
  loginWithEmailPassword, 
  loginWithGoogle, 
  loginWithFacebook,
  verifyToken // Include verifyToken in exports
};
