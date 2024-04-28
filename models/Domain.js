const mongoose   =  require ('mongoose')
const Schema     =  mongoose.Schema

const DomainSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
})

const Domain = mongoose.model('Domain',DomainSchema)
module.exports = Domain