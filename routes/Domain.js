const express = require('express');
const router = express.Router();
const DomainController = require('../controllers/DomainController');

const authenticate = require('../middleware/authenticate');

router.get('/',  DomainController.index);
router.post('/store', DomainController.store);
router.post('/save', DomainController.verifisexist);
router.get('/show/:id', DomainController.show);
router.put('/update/:id', DomainController.update);
router.delete('/delete/:id', DomainController.destroy);


module.exports = router;
