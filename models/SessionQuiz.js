const mongoose = require('mongoose');

const SessionQuizSchema = new mongoose.Schema({
    idquiz: { type: String, required: true },
    iduser: { type: String, required: true },
    datedeb: { type: Date, timestamps: true },
    datefin: { type: Date }
});

// Custom validator to ensure exactly 4 choices


SessionQuizSchema.statics.deleteByUserAndQuiz = async function (iduser, idquiz) {
    try {
      const sessionQuiz = await this.findOne({ iduser, idquiz });
      if (sessionQuiz) {
        await sessionQuiz.deleteOne();
        console.log(`SessionQuiz with iduser ${iduser} and idquiz ${idquiz} deleted.`);
      } else {
        console.log(`No SessionQuiz found with iduser ${iduser} and idquiz ${idquiz}.`);
      }
    } catch (err) {
      console.error(`Error deleting SessionQuiz with iduser ${iduser} and idquiz ${idquiz}:`, err);
    }
  };
  const SessionQuiz = mongoose.model('SessionQuiz', SessionQuizSchema);
  
  module.exports = SessionQuiz;