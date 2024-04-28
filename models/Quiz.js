const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    choices: { type: [String], required: true },
    iddomain:{type: String}
});

// Custom validator to ensure exactly 4 choices

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
