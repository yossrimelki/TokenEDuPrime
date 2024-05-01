const express = require('express');
const multer = require('multer');
const path = require("path");
const { addP, getPById, getAllP, updateP, deleteP } = require('../controllers/Cours.js'); // Import des fonctions de contrôle pour les cours

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const router = express.Router();

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"), // Définir le répertoire de destination
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${Date.now()}${name}`);
  },
});

const upload = multer({ storage: storage });

// Routes CRUD pour les cours
router.post('/add', upload.single("image"), addP); // Ajouter un cours
router.get('/', getPById); // Obtenir un cours par ID
router.get('/getall', getAllP); // Obtenir tous les cours
router.put('/', updateP); // Mettre à jour un cours
router.delete('/', deleteP); // Supprimer un cours

module.exports = router; // Export du routeur pour les cours
