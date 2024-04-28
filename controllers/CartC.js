const CartM = require("../models/CartM.js");
const dotenv = require('dotenv');
const stripeModule = require('stripe');
const API_SECRET = process.env.KEYSTRIPE;
const stripe = stripeModule(process.env.KEYSTRIPE);
const CourS = require("../models/CourS.js");

// Add a new
async function addCart(req, res) {
    try {
        var { userId, totalC ,products} = req.body;

        // Create a new cart
        var newCart = new CartM({
            products: [], // Initialize the products array as empty
            totalC: totalC || 0, // Set an initial total or set to 0
        });

        await newCart.save();

        res.status(201).json({      
            message: 'Cart added successfully',
            cart: newCart,
        });
    } catch (error) {
        res.status(500).json('An error has occurred');
    }
}

async function pay(req, res) {
    try {
        console.log("reqqqqqqqqqqqqqqqq");
        console.log(req.body);   
        
        const { totalC } = req.body; // Get the total amount from the request body
        console.log('Creating payment intent with amount:', totalC); // Log the amount for debugging
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseFloat(totalC) * 100, // Convert to cents
            currency: 'usd', // Assuming the currency is still euro
        });
        console.log('Payment intent created:', paymentIntent); // Log the successful creation
        return res.json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error during payment:', error); // Log the full error
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Erreur lors du paiement' });
        }
    }
}

async function getPById(req, res) {
    try {
        const cartId = req.body.cartId;
        const cart = await CartM.findById(cartId).populate('product');

        // Assuming 'product' is correctly set up in your Mongoose schema to reference products
        const products = cart.product;  // This will give you the array of populated products

        // Return just the list of products for this cart
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "An error has occurred!" });
    }
}

async function getAllC(req, res) {
    try {
        const listC = await CartM.find().populate('product');
        res.status(200).json(listC);
    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(500).json({ message: "An error has occurred!", error: error.message });
    }
}

async function addProductToCart(req, res) {
    try {
        const cartId = req.body.cartId;
        const productId = req.body.productId;
        const cart = await CartM.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = await CourS.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } else {
            // Check if the product is already in the cart
            const productExistsInCart = cart.product.some(p => p._id.equals(productId));

            // If the product is not in the cart, add it
            if (!productExistsInCart) {
                cart.product.push(product);
                await cart.save();
                res.status(200).json({ message: "Product added successfully" });
            } else {
                // If the product is already in the cart, inform the user
                res.status(409).json({ message: "Product already in cart" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeProductToCart (req, res)  {
    try {
        const cartId = req.body.cartId;
        const productId = req.body.productId;
        const cart = await CartM.findById(cartId);
        if (!cart) {
            res.status(404).json({ message: "cart not found" });
        }
    
        cart.product = cart.product.filter(
            (existingproduct) => existingproduct.toString() !== productId
        );
    
        await cart.save();
    
        res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function calculateCartTotal(req, res) {
    try {
        const cartId = req.body.cartId;
        const cart = await CartM.findById(cartId).populate('product');  // Make sure 'products' is the correct path

        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        // Calculate the total by summing the price of each product
        let totalC = 0;
        for (let product of cart.product) {
            totalC += parseFloat(product.priceP);  // Assuming the product model has a 'price' field
        }

        // Update the totalC in the cart
        cart.totalC = totalC;
        await cart.save();

        res.status(200).json({
            message: 'Total calculated successfully',
            total: totalC.toFixed(2), // Converts number to string with 2 decimal places
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred', error: error.message });
    }
}

///////////////////// NEW
async function fetchStripePaymentsForMonth(year, month) {
    // Assuming year and month are integers representing the year and month for which you want to fetch payments
    const startOfMonth = new Date(year, month - 1, 1).getTime() / 1000;
    const endOfMonth = new Date(year, month, 0).getTime() / 1000;

    try {
        const payments = await stripe.charges.list({
            created: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
            limit: 100,
        });
        return payments.data;
    } catch (error) {
        console.error('Error fetching payments from Stripe:', error);
        throw error;
    }
}

async function getMonthlyStripePayments(req, res) {
    const { year, month } = req.params;

    try {
        const payments = await fetchStripePaymentsForMonth(parseInt(year), parseInt(month));
        res.json({ data: payments });
    } catch (error) {
        console.error('Error fetching monthly payments:', error);
        res.status(500).json({ message: 'Failed to fetch monthly payments', error: error.message });
    }
}

module.exports = { addCart, addProductToCart ,removeProductToCart,getAllC,getPById,calculateCartTotal,pay,getMonthlyStripePayments };
