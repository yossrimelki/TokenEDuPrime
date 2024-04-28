const express = require('express');
const { createQuizQuestion, fetchRandomQuizQuestion,checkAnswer } = require('../controllers/Quiz.js');

const router = express.Router();

// Route to create a new quiz question
router.post('/quiz', createQuizQuestion);
router.get('/quiz', fetchRandomQuizQuestion);
router.post('/anwser',checkAnswer);

module.exports = router;
