const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, requestPasswordReset, resetPassword } = require('../controllers/userController');

const router = express.Router();

// Existing user routes
router.post('/createuser', createUser);
router.get('/getusers', getUsers);
router.get('/getuser/:id', getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

// Password reset routes
router.post('/reset-password/request', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
