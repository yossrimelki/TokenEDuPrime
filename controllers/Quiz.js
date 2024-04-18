const Quiz = require('../models/Quiz.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


async function parseResponse(response) {
    try {
        const data = JSON.parse(response); // Parse the single JSON object

        return data;
    } catch (error) {
        console.error("Error parsing response:", error);
        return response; // Handle parsing errors by returning null
    }
}




// Controller function to create a new quiz question
exports.createQuizQuestion = async (req, res) => {
    
    const { category, level } = req.body;
    console.log('Received payload:', { category, level });
    const generatedQuestions = [];

    try {

        // For text-only input, use the gemini-pro model
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "Hello.",
                },
                {
                    role: "model",
                    parts: "Great to meet you. What would you like to know?",
                },
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });


        const msg = `Generate 1 JSON responses about ${level} level ${category} in the following format :
              {
                "question": "question",
                "correct_answer": "answer",
                "choices": [
                  "choice 1",
                  "choice 2",
                  "choice 3",
                  "choice 4"
                ]
              }
              i need to use the json response in my code later so please provide only the json format and nothing else do not even enumerate the responses 
              again please keep in mind that the response is going to be parsed and used later so i need a  json response and no extra.
              just want the  json response that starts with { and ends with } do not add these at the beginning or end \`\`\` `;

        const result = await chat.sendMessage(msg);
        console.log("res: ", result);
        const response = await result.response;
        for (let i = 0; i < 2; i++) {
            const msg = `great give me 1 more`;

            const result = await chat.sendMessage(msg);
            console.log(result);
            const response = await result.response;
            console.log(response.text);


            const text = response.text();
            console.log(response.text);
            const parsedData = await parseResponse(text);

            const newQuestion = new Quiz({
                question: parsedData.question,
                correct_answer: parsedData.correct_answer,
                choices: parsedData.choices,
            });
            console.log("question to be saved: ",newQuestion);
             await newQuestion.save();
            generatedQuestions.push(newQuestion);
        }
        console.log(response.text());
        console.log("response: ", response);
        if (response.hasErrorMessage) {
            console.warn("Model is overloaded or failed to generate a response. Using static data.");
            // Add static data to the database (replace with your actual data)

        }


        res.status(201).json(generatedQuestions);
    } catch (error) {
        console.error("Error:", error);
    }



};



exports.createQuizQuestion5 = async (req, res) => {
    const { category, level } = req.body; // Add numberOfQuestions parameter

    try {
        const chat = model.startChat({
            history: [
                { role: "user", parts: "Hello." },
                { role: "model", parts: "Great to meet you. What would you like to know?" },
            ],
            generationConfig: { maxOutputTokens: 100 },
        });

        const baseMsg = `Generate 4 JSON responses about beginner level java in the following format :
        {
          "question": "question",
          "correct_answer": "answer"
        }
        i need to use the json response to parse it  in my code later so please provide only the json format and nothing else do not even enumerate the responses 
        again please keep in mind that the response is going to be parsed and used later so i need a  json response and no extra.
        just want the  json response that starts with { and ends with } do not add these at the beginning or end \`\`\` `;
        const result = await chat.sendMessage(baseMsg);
        //console.log(result);
        const response = await result.response;
        // console.log(response.text);




        res.status(201).json({ message: response });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Handle errors gracefully
    }
};

exports.fetchRandomQuizQuestion = async (req, res) => {
    try {
        // Fetch a random quiz question from the database
        const quizQuestion = await Quiz.aggregate([{ $sample: { size: 2 } }]);

        // If no question is found, return a 404 Not Found response
        if (!quizQuestion || quizQuestion.length === 0) {
            //return res.status(404).json({ message: 'Quiz question not found' });
            console.warn("Quiz question not found.");
        }

        // Respond with the fetched quiz question
        res.status(200).json({ question: quizQuestion });
    } catch (error) {
        // Handle errors
        console.error('Error fetching quiz question:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
