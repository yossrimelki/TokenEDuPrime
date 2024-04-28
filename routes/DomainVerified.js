const express = require('express');
const router = express.Router();
const DomainVerifiedController = require('../controllers/DomainVerifiedController');

const authenticate = require('../middleware/authenticate');

router.get('/',  DomainVerifiedController.index);
router.post('/store', DomainVerifiedController.store);
router.get('/show/:id', DomainVerifiedController.show);
router.put('/update/:id', DomainVerifiedController.update);
router.delete('/delete/:id', DomainVerifiedController.destroy);

module.exports = router;
