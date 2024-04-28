const { Router } = require('express');
const {
    addCart,
    addProductToCart,
    getAllC,
    removeProductToCart,
    getPById,
    calculateCartTotal,
    pay,
    getMonthlyStripePayments
} = require('../controllers/CartC.js');

const stripeModule = require('stripe');
const API_SECRET = process.env.KEYSTRIPE;
const stripe = stripeModule(process.env.KEYSTRIPE);

const { getAllP } = require('../controllers/Cours.js');
const router = Router();

// Create a new producSt
router.post('/add', addCart);
router.put('/adPtC', addProductToCart);
router.delete('/rmPtC', removeProductToCart);
router.post('/get', getPById);
router.get('/getall', getAllC);
router.post('/total', calculateCartTotal);
router.post('/pay', pay);
router.get('/payments/:year/:month', getMonthlyStripePayments);
module.exports = router;
