const mongoose   =  require ('mongoose')
const Schema     =  mongoose.Schema

const CourS = new Schema(
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

    priceP: {
      type: String,
      required: true,
    },
   

  },
  {
    timestamps: true,
  }
);
const cour = mongoose.model('Cour', CourS)
module.exports = cour;
 


