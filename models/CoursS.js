const mongoose = require('mongoose');

const tutosSchema = new mongoose.Schema({
    description: String,
    name: String,
    videos: [{ videoUrl: String }]
});

const Cours =mongoose.model('Tutorials',tutosSchema) ;


module.exports = Cours;
