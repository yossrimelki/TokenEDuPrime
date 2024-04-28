const { response } = require("express");
const CourS = require("../models/CourS.js");
const dotenv = require('dotenv');

dotenv.config();

// Get -- All Products

async function getAllP(req, res) {
    try {
        const listP = await CourS.find();
        res.status(200).json(listP);
    } catch (error) {
        res.status(500).json("An error has occurred!");
    }
}

// Get --Product by Id

async function getPById(req, res) {
    try {
        const produitId = req.body.produitId;
        const produit = await CourS.findById(produitId);
        res.json({
            produit,
        });
    } catch (error) {
        res.status(500).json("An error has occurred!");
    }
}

// Add Product

async function addP(req, res) {
    console.log(req.file);
    try {
        // Initialize newProduct with data from the request body
        var newProduct = {
            nameP: req.body.nameP,
            descriptionP: req.body.descriptionP,
            priceP: Number(req.body.priceP), // Convert priceP from string to Number if necessary
            typeP: req.body.typeP,
        };

        // Handle image file if uploaded
        if (req.file) {
            const networkIP = '192.168.128.207'; // Replace with your actual server IP or hostname

            // Set the image field to be a string containing the URL to the image
            // Adjust the port (9001) and path ('/img/') if different in your setup
            newProduct.image = req.file.filename;
        } else {
            newProduct.image = ''; // If no file uploaded, default to an empty string
        }

        // Create a new product using the ProductM model
        var product = new CourS(newProduct);
        await product.save(); // Save the new product to the database

        // Respond with a status code of 201 and the new product information
        res.status(201).json({
            message: 'Product added successfully',
            product: product,
        });
    } catch (error) {
        console.error(error); // Log the error for server-side debugging
        res.status(500).json({ error: 'An error has occurred!' }); // Send a 500 Internal Server Error response
    }
}

// update Product

// Assuming req.body contains { produitId, nameP, descriptionP, priceP, typeP }
async function updateP(req, res) {
    try {
        const produitId = req.body.produitId;
        const update = {
            nameP: req.body.nameP,
            descriptionP: req.body.descriptionP,
            priceP: req.body.priceP,
            typeP: req.body.typeP
        };

        const updatedProduct = await CourS.findByIdAndUpdate(produitId, update, { new: true });

        if (updatedProduct) {
            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error has occurred!', error: error.toString() });
    }
}

// delete product
async function deleteP(req, res) {
    try {
        const produitId = req.body.produitId;

        const deletedProduct = await CourS.findByIdAndDelete(produitId);

        if (deletedProduct) {
            res.status(200).json({
                message: 'Product deleted successfully',
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json("An error has occurred!");
    }
}

module.exports = { getPById, getAllP, addP, updateP, deleteP };
