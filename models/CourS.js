const mongoose = require("mongoose");


const { Schema } = mongoose;

const produitSchema = new Schema(
  {
    nameP: {
      type: String,
      required: true,
    },
    descriptionP: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: String, // Utiliser Schema.Types.Mixed pour accepter les nombres et les caractères
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
const CourS = mongoose.model('Cours', produitSchema);
module.exports = CourS;
