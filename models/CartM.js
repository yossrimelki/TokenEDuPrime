const mongoose   =  require ('mongoose')
const Schema     =  mongoose.Schema

const cartSchema = new Schema(
  {
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }, 
      product: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Produit',
        },
      ],
      totalC: {
        type: Number,
        required: true
      },
  },
    {
        timestamps: true,
      }
    
    );
    const cartM=mongoose.model('Cart', cartSchema);

module.exports = cartM;