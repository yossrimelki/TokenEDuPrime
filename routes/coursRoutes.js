const express = require('express');
const multer = require('multer');
const {
    addP,
    getPById,
    getAllP,
    updateP,
    deleteP,
} = require('../controllers/Cours.js');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public"); // Define where to store files
    },
    filename: function(req, file, cb) {
        cb(null, req.body["nameP"] + Date.now() + ".jpeg");
    },
});
const upload = multer({
    storage: storage,
});

// Create a new producSt
router.post('/add', upload.single("image"), addP);

// Get a product by ID
router.get('/', getPById);

// Get all products
router.get('/getall', getAllP);

// Update a product by ID
router.put('/', updateP);

// Delete a product by ID
router.delete('/', deleteP);

module.exports = router;
