const { response } = require("express");
const CourS = require("../models/CourS.js"); // Assuming .js extension for CommonJS
const dotenv = require('dotenv');

dotenv.config();

async function getAllP(req, res) {
  try {
    const listP = await CourS.find();
    res.status(200).json(listP);
  } catch (error) {
    res.status(500).json("An error has occurred!");
  }
}

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

async function addP(req, res) {
  console.log(req.file);
  try {
    if (!req.file) {
      throw new Error('Image field is required');
    }

    const newProduct = {
      nameP: req.body.nameP,
      descriptionP: req.body.descriptionP,
      image: req.file.path,
      rating: req.body.rating
    };

    const product = new CourS(newProduct);
    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function updateP(req, res) {
  try {
    const produitId = req.body.produitId;
    const update = {
      nameP: req.body.nameP,
      descriptionP: req.body.descriptionP,
      image: req.file.path,
      rating: req.body.rating
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
