const express = require('express');
const { createQuizQuestion, fetchRandomQuizQuestion,checkAnswer ,createProblem,solveProblem,createNextQuestion} = require('../controllers/Quiz.js');

const router = express.Router();

// Route to create a new quiz question
router.post('/quiz', createQuizQuestion);
router.get('/quiz', fetchRandomQuizQuestion);
router.post('/anwser',checkAnswer);
router.post('/prob',createProblem);
router.post('/solve',solveProblem);
router.post('/next', createNextQuestion);

module.exports = router;
