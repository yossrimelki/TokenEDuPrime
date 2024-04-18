const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, AdminController.index);
router.post('/store', upload.single('avatar'), AdminController.store);
router.get('/show/:adminID', AdminController.show);
router.put('/update/:adminID', AdminController.update);
router.delete('/delete/:adminID', AdminController.destroy);

module.exports = router;
