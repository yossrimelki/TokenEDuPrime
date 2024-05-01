const express = require('express');
const { register, loginWithEmailPassword, loginWithGoogle, loginWithFacebook } = require('../controllers/AuthController');

const router = express.Router();

router.post('/registration', register);
router.post('/login/email', loginWithEmailPassword);
router.post('/login/google', loginWithGoogle);
router.post('/login/facebook', loginWithFacebook);

module.exports = router;
