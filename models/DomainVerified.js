const mongoose   =  require ('mongoose')
const Schema     =  mongoose.Schema

const DomainVerifiedSchema = new Schema({
    iduser: {
        type: String
    },
    iddomain: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    }
})

const DomainVerified = mongoose.model('DomainVerified',DomainVerifiedSchema)
module.exports = DomainVerified