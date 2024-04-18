const mongoose = require('mongoose')
const Schema   = mongoose.Schema 

const userSchema  = new  Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER'
    },
    token:{
        type: String,
        default: ''
    },
    AddWalet:{
        type: String,
        default: ''
    },
    pkeyWalet:{
        type: String,
        default: ''
    },

}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User