const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require ("nodemailer");
const config = require("../config/config")
const randomstring = require ("randomstring");
const ethers = require('ethers');


///////////////////////////////////////////////////////





//////////////////////////

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async function (err, hashedPass) {
        if (err) {
            return res.status(500).json({ error: 'An error occurred!' });
        }

        try {
            // Generate wallet address and private key
            const wallet = ethers.Wallet.createRandom();
            
            // Save user with generated wallet details
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass,
                AddWalet: wallet.address,
                pkeyWalet: wallet.privateKey,
            });

            if (req.file) {
                user.img = req.file.path;
            }

            await user.save(); // Wait for user to be saved
            res.json({
                message: 'User Added Successfully!',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

const login = (req, res, next) => {
    var username = req.body.email;
    var password = req.body.password;

    User.findOne({ email: username })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'No user found!' });
            }

            bcrypt.compare(password, user.password, function (err, result) {
                if (err || !result) {
                    return res.status(401).json({ message: 'Password does not match' });
                }

                let token = jwt.sign({ name: user.name }, 'yourSecretKey', {
                    expiresIn: '24h'
                });
                let refreshsecretkey = jwt.sign({ name: user.name }, 'refreshsecretkey', {
                    expiresIn: '48h'
                });
                res.status(200).json({
                    message: 'Login Successful!',
                    token,
                    refreshsecretkey,
                });
            });
        })
        .catch((error) => {
            res.status(500).json({ message: 'An error occurred!' });
        });
};


const sendResetPassword = async (name, email, token) => {
    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        // Compose email options
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Password',
            html: `<p>Hi ${name}, <br> Your Token Code Is : ${token}<br> Copy it and reset your password!</p>`
        };

        // Send email
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Mail has been sent:", info.response);
            }
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const randomString = randomstring.generate();
            // Update user's token
            await User.updateOne({ email: email }, { $set: { token: randomString } });
            // Send reset password email
            await sendResetPassword(userData.name, userData.email, randomString);
            res.status(200).send({ success: true, msg: "Please check your inbox and reset your password." });
        } else {
            res.status(200).send({ success: true, msg: "This email doesn't exist!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        const userData = await User.findOne({ token: token });
        if (userData) {
            const password = req.body.password;
            const new_password = await securePassword(password);
            // Update user's password and clear token
            const updatedUser = await User.findByIdAndUpdate(
                { _id: userData._id },
                { $set: { password: new_password, token: '' } },
                { new: true }
            );
            res.status(200).send({ success: true, msg: "User password has been reset", data: updatedUser });
        } else {
            res.status(200).send({ success: false, msg: "This link has expired!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        throw new Error(error.message);
    }
};

////////////////////////

module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
};
