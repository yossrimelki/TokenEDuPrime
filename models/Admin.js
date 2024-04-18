const mongoose   =  require ('mongoose')
const Schema     =  mongoose.Schema

const adminSchema = new Schema({
    name: {
        type: String
    },
    bio: {
        type: String
    },
    email: {
        type: String
       
     },
     age: {
        type: Number
       
     },
    avatar: {
        type: String
    }

},{timestamps: true})

const Admin = mongoose.model('Admin',adminSchema)
module.exports = Admin