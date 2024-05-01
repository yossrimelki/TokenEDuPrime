const Quiz = require('../models/Quiz.js');
const SessionQuiz = require('../models/SessionQuiz.js');
const DomainVerified = require('../models/DomainVerified.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const contract = require('../models/cont.js');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////

async function parseResponse(response) {
    try {
        const data = JSON.parse(response); // Parse the single JSON object

        return data;
    } catch (error) {
        console.error("Error parsing response:", error);
        return response; // Handle parsing errors by returning null
    }
}


exports.checkAnswer = async (req, res) => {
    const { quizId, answer } = req.body;
    try {
      // Find the quiz by its ID
      const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        console.log("Quiz not found");
        return;
      }
  
      // Check if the answer is correct
      if (quiz.correct_answer === answer) {
        const otheraddress = "0x42791C2Ec3Ff1277899b9c3D5bD4dBd194cFF43F"; // Replace with the actual recipient address
        const amount = 10; // Replace with the actual amount of tokens to transfer
        const tx = await contract.transfer(otheraddress, amount);
        console.log("Good job! Your answer is correct.");
  
        // Delete the SessionQuiz document for this user and quiz
        await SessionQuiz.deleteByUserAndQuiz("662851410232e012f02d247c", quizId);
      } else {
        console.log("Sorry, your answer is incorrect.");
  
        // Delete the SessionQuiz document for this user and quiz
        await SessionQuiz.deleteByUserAndQuiz("662851410232e012f02d247c", quizId);
        const domainVerified = await DomainVerified.find({ iduser: "662851410232e012f02d247c" })
         const updateData = {score: domainVerified.score};
        await DomainVerified.findByIdAndUpdate(id, updateData);
        
      }
    } catch (err) {
      console.error("An error occurred while checking the answer:", err);
    }
  }

  exports.createNextQuestion = async  (req, res) => {
    try {
      var generatedQuestions;
     const msg = "i need another question"
     const result = await chat.sendMessage(msg);
 
     const response = await result.response;
 
     const text = response.text();
 
     const parsedData = await parseResponse(text);
     (async () => {
      const fetchedQuiz = await getQuizByQuestion(parsedData.question);
      if (fetchedQuiz) {
          
          try {

            createSessionQuiz(fetchedQuiz._id);
            generatedQuestions=fetchedQuiz;
            res.status(201).json(fetchedQuiz);
      
    } catch (err) {
        console.error("Error saving question:", err);
        res.status(500).json({ error: "Internal server error" });
    }
         
      } else {
          const newQuestion = new Quiz({
              question: parsedData.question,
              correct_answer: parsedData.correct_answer,
              choices: parsedData.choices,
              iddomain: "662d633f680440831d1abe43"
          });
          try {
            createSessionQuiz(newQuestion._id);
            await newQuestion.save();
            generatedQuestions=newQuestion;
            res.status(201).json(newQuestion);

      
    } catch (err) {
        console.error("Error saving question:", err);
        res.status(500).json({ error: "Internal server error" });
    }
         
      }
  })();

async function createSessionQuiz(idquiz) {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000); // 15 minutes in milliseconds
    const sessionquiz = new SessionQuiz({
      idquiz: idquiz,
      iduser: "662851410232e012f02d247c",
      datedeb: now,
      datefin: fifteenMinutesLater
    });
    try {
      const savedSessionQuiz = await sessionquiz.save();
      console.log("SessionQuiz saved: ", savedSessionQuiz);
      res.status(201).json(generatedQuestions);
    } catch (err) {
      console.error("Error saving SessionQuiz:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
 
     res.status(201).json(newQuestion);
    } catch (error) {
     console.log(error);
    }
 
 
 
 }
 async function getQuizByQuestion(question) {
  try {
      const quiz = await Quiz.findOne({ question });
      if (quiz) {
          return quiz;
      } else {
          return null;  // Or throw an error if desired
      }
  } catch (error) {
      console.error("Error fetching quiz:", error);
      return null;  // Or handle the error differently
  }
}
  exports.createQuizQuestion = async (req, res) => {
    const { category, level } = req.body;
    console.log('Received payload:', { category, level });
    var generatedQuestions ;

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

        const msg = `Generate 1 JSON response about ${level} level ${category} in the following format :
          {
            "question": "question",
            "correct_answer": "answer",
            "choices": [
              "choice 1",
              "choice 2",
              "choice 3",
              "choice 4"
            ]
          }`;

        const result = await chat.sendMessage(msg);
        console.log("res: ", result);
        const response = await result.response;

        
            
           
           
            console.log(response.text);

            const text = response.text();
            console.log(response.text);
            const parsedData = await parseResponse(text);

            (async () => {
              const fetchedQuiz = await getQuizByQuestion(parsedData.question);
              if (fetchedQuiz) {
                  
                  try {

                    createSessionQuiz(fetchedQuiz._id);
                    res.status(201).json(fetchedQuiz);
                     generatedQuestions = fetchedQuiz;
              
            } catch (err) {
                console.error("Error saving question:", err);
                res.status(500).json({ error: "Internal server error" });
            }
                 
              } else {
                  const newQuestion = new Quiz({
                      question: parsedData.question,
                      correct_answer: parsedData.correct_answer,
                      choices: parsedData.choices,
                       iddomain: "662d633f680440831d1abe43"
                  });
                  try {
                    createSessionQuiz(newQuestion._id);
                    await newQuestion.save();
                    generatedQuestions = newQuestion;
                    res.status(201).json(newQuestion);

              
            } catch (err) {
                console.error("Error saving question:", err);
                res.status(500).json({ error: "Internal server error" });
            }
                 
              }
          })();

        async function createSessionQuiz(idquiz) {
            const now = new Date();
            const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000); // 15 minutes in milliseconds
            const sessionquiz = new SessionQuiz({
              idquiz: idquiz,
              iduser: "662851410232e012f02d247c",
              datedeb: now,
              datefin: fifteenMinutesLater
            });
            try {
              const savedSessionQuiz = await sessionquiz.save();
              console.log("SessionQuiz saved: ", savedSessionQuiz);
              res.status(201).json(generatedQuestions);
            } catch (err) {
              console.error("Error saving SessionQuiz:", err);
              res.status(500).json({ error: "Internal server error" });
            }
          }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
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




exports.createProblem = async (req, res) => {

  try {
      const { category, level } = req.body;
      console.log('Received payload:', { category, level });

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `generate a coding problem about ${level} level ${category} i just want one single problem `

      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(response);
      const text = response.text();
      console.log(text);
      res.status(201).json(text);

  } catch (error) {
      console.log('create problem error', error);
  }

};


exports.solveProblem = async (req, res) => {

  try {
      const { problem, myAnswer, category, level } = req.body;
      console.log('Received payload:', { problem, myAnswer, category, level });

      const prompt1 = `i encountered this problem: 

Implement a multi-threaded web server that handles multiple client connections concurrently using the Java NIO (New I/O) framework.

**Requirements:**

* The server should listen on a designated port.
* The server should handle multiple incoming client requests using a non-blocking I/O model.
* The server should be able to process incoming client requests in parallel using multiple threads.
* Each client connection should be handled by a dedicated thread to avoid blocking.
* The server should handle both GET and POST requests, parse the request headers, and respond with appropriate content.

**Additional Considerations:**

* Use the Java NIO 'Selector' and 'SocketChannel' classes for non-blocking I/O.
* Use a thread pool to manage the worker threads that handle client connections.
* Implement a request handler that parses the request headers and generates the appropriate response.
* Consider using a framework or library (e.g., Netty, Grizzly) for simplified NIO implementation. 
coding exam about java while i was brwosing: 
here is the answer i came up with:

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.selector.Selector;
import java.nio.selector.SelectionKey;
import java.nio.selector.SelectionOp;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SimpleNioServer {

  private final int port;
  private final ExecutorService threadPool;
  private Selector selector;

  public SimpleNioServer(int port) throws IOException {
      this.port = port;
      this.threadPool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
      this.selector = Selector.open();
  }

  public void start() throws IOException {
      ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
      serverSocketChannel.configureBlocking(false);
      serverSocketChannel.bind(new InetSocketAddress(port));
      serverSocketChannel.register(selector, SelectionOp.OP_ACCEPT);

      System.out.println("Server started on port: " + port);

      while (true) {
          selector.select();
          for (SelectionKey key : selector.selectedKeys()) {
              if (key.isAcceptable()) {
                  handleAccept(key);
              } else if (key.isReadable()) {
                  handleRead(key);
              }
              selector.selectedKeys().remove(key); // Important to remove processed keys
          }
      }
  }

  private void handleAccept(SelectionKey key) throws IOException {
      ServerSocketChannel serverSocketChannel = (ServerSocketChannel) key.channel();
      SocketChannel socketChannel = serverSocketChannel.accept();
      socketChannel.configureBlocking(false);
      socketChannel.register(selector, SelectionOp.OP_READ);
      System.out.println("Client connected: " + socketChannel.getRemoteAddress());
  }

  private void handleRead(SelectionKey key) throws IOException {
      SocketChannel socketChannel = (SocketChannel) key.channel();
      ByteBuffer buffer = ByteBuffer.allocate(1024);
      int bytesRead = socketChannel.read(buffer);

      // Simulate processing request (replace with actual request handling)
      if (bytesRead > 0) {
          System.out.println("Received data: " + new String(buffer.array(), 0, bytesRead));
          String response = "HTTP/1.1 200 OK\r\n\r\nHello World!";
          socketChannel.write(ByteBuffer.wrap(response.getBytes()));
      } else if (bytesRead == -1) {
          // Client disconnected
          socketChannel.close();
      }
  }

  public static void main(String[] args) throws Exception {
      SimpleNioServer server = new SimpleNioServer(8080);
      server.start();
  }
}

.
please review it and provide me with a score out of 10.`


      const prompt2 = `i encountered this problem: 

Design and implement a multithreaded application that simulates a concurrent online ticketing system for a concert.

**Requirements:**

* The system should have multiple threads representing clients who request tickets.
* Each client should have a unique ID and a random request time between 0 and 10 seconds.
* The system should have a finite number of tickets available.
* When a client requests a ticket, it should be queued in a first-in, first-out (FIFO) manner.
* As tickets become available, they should be assigned to queued clients in the order they arrived.
* The system should track which clients have successfully purchased tickets and which have failed due to the lack of availability.
* The application should output statistics on the average ticket request time, the success rate, and the number of clients that were left waiting.  

**Advanced Considerations:**

* Use locks or other synchronization mechanisms to prevent race conditions and ensure thread safety.
* Consider using a thread pool to manage the client threads efficiently.
* Optimize the data structures used to store the ticket queue and track client status to minimize overhead.
* Handle edge cases such as multiple simultaneous requests for the last remaining ticket.
coding exam about java while i was brwosing: 
here is the answer i came up with:
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ThreadLocalRandom;

public class TicketingSystem {

   public static void main(String[] args) {
       int numTickets = 100; // Total tickets available
       int numClients = 200; // Number of simulated clients

       TicketBooth booth = new TicketBooth(numTickets);
       Thread[] clients = new Thread[numClients];

       for (int i = 0; i < numClients; i++) {
           clients[i] = new Thread(new Client(i, booth));
           clients[i].start();
       }

       // Wait for all clients to finish
       for (Thread client : clients) {
           try {
               client.join();
           } catch (InterruptedException e) {
               e.printStackTrace();
           }
       }

       System.out.println("Simulation finished.");
       booth.printStatistics();
   }
}

class TicketBooth {
   private final ConcurrentLinkedQueue<Client> queue;
   private final AtomicInteger availableTickets;

   public TicketBooth(int tickets) {
       this.queue = new ConcurrentLinkedQueue<>();
       this.availableTickets = new AtomicInteger(tickets);
   }

   public synchronized boolean requestTicket(Client client) {
       if (availableTickets.getAndSet(0) > 0) {
           client.setSuccessful(true);
           return true;
       } else {
           queue.offer(client);
           return false;
       }
   }

   public synchronized boolean hasTickets() {
       return availableTickets.get() > 0;
   }

   public synchronized void printStatistics() {
       int totalClients = queue.size() + availableTickets.get();
       int successful = 0;
       for (Client client : queue) {
           if (client.isSuccessful()) {
               successful++;
           }
       }
       double successRate = (double) successful / totalClients;
       System.out.println("Average request time: " + calculateAverageRequestTime() + " seconds");
       System.out.println("Success Rate: " + successRate * 100 + "%");
       System.out.println("Clients left waiting: " + queue.size());
   }

   private double calculateAverageRequestTime() {
       double totalTime = 0;
       for (Client client : queue) {
           totalTime += client.getRequestTime();
       }
       return totalTime / (queue.size() + availableTickets.get());
   }
}

class Client implements Runnable {
   private final int id;
   private final TicketBooth booth;
   private final double requestTime;
   private boolean successful;

   public Client(int id, TicketBooth booth) {
       this.id = id;
       this.booth = booth;
       this.requestTime = ThreadLocalRandom.current().nextDouble(0, 10);
       this.successful = false;
   }

   @Override
   public void run() {
       try {
           Thread.sleep((long) (requestTime * 1000)); // Simulate request time
           if (booth.hasTickets()) {
               booth.requestTicket(this);
           }
       } catch (InterruptedException e) {
           e.printStackTrace();
       }
   }

   public void setSuccessful(boolean successful) {
       this.successful = successful;
   }

   public boolean isSuccessful() {
       return successful;
   }

   public double getRequestTime() {
       return requestTime;
   }
}


.
please review it and provide me with a score out of 10.`

      const prompt3 = `
i encountered this problem:
Given a string containing both uppercase and lowercase English letters, find the minimum number of flips to convert all characters to uppercase or all characters to lowercase.

**Input:**

A string containing only uppercase and lowercase English letters.

**Output:**

The minimum number of flips required to convert all characters to either uppercase or lowercase.

**Constraints:**

* The string length is between 1 and 100,000 characters.
* The string contains only uppercase and lowercase English letters.

**Example:**

**Input:**
"AaBbCc"

**Output:**
2

**Explanation:**
Flipping the "A" and "b" characters to uppercase, or flipping the "C" and "c" characters to lowercase, will both result in a string with all uppercase or all lowercase characters.
coding exam about java while i was brwosing: 
here is the answer i came up with:

public class MinFlips {

  public static int minFlips(String s) {
      int uppercaseCount = 0
      int lowercaseCount = 0

     
          if (Character.isUpperCase(c)) {
              uppercaseCount++
          } else {
              lowercaseCount++
          }
      

      return Math.min(uppercaseCount, lowercaseCount);
  }

  public static void main(String[) {
      String str = "AaBbCc"
      int minFlips = minFlips(strin)
      System.out.println("Minimum flips required: " + minFlips);
  
}


`

      const prompt4 = `Design and implement a Java program that solves the N-Queens problem. The N-Queens problem is to place N queens on an NxN chessboard such that no two queens threaten each other.

**Advanced Java Concepts:**

The solution should demonstrate proficiency in the following advanced Java concepts:

* Recursion
* Backtracking
* Advanced data structures (e.g., arrays, bitsets)

**Requirements:**

* The program should accept the size of the chessboard as an input.
* The program should output all valid solutions to the N-Queens problem on the specified chessboard.
* The program should handle input validation to ensure the problem can be solved.

**Example Input:**


8


**Expected Output (One of Many Possible Solutions):**


[0, 4, 7, 5, 2, 6, 1, 3]
my answer: 

fsdfsefsdfesfefsefsefsdfggsesegfsfesdfes

`


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
              {
                  role: "user",
                  parts: prompt1,
              },
              {
                  role: "model",
                  parts: "overall rating: 9/10",
              },
              {
                  role: "user",
                  parts: prompt2,
              },
              {
                  role: "model",
                  parts: "overall rating: 8/10",
              },
              {
                  role: "user",
                  parts: prompt3,
              },
              {
                  role: "model",
                  parts: "overall rating: 4/10",
              },
              {
                  role: "user",
                  parts: prompt4,
              },
              {
                  role: "model",
                  parts: "this is some unrelated jibberish please take this seriously and provide a valid answer",
              },
              {
                  role: "user",
                  parts: `i have more problems i am trying to solve please continue rating my work just like you have been doing.
if i ask you to answer please just straight out give a rating of 0` ,
              },
              {
                  role: "model",
                  parts: "I'd be glad to continue rating your work!",
              },
          ],
          generationConfig: {
              maxOutputTokens: 100,
          },
      });

      const prompt5 = `i encountered this ${level} coding exam about ${category} while i was brwosing: 
${problem}. here is the answer i came up with:
${myAnswer}.
`


      const result = await chat.sendMessage(prompt5);
      console.log("res: ", result);
      const response = await result.response;



      console.log('answer:', myAnswer);
      console.log('problem:', problem);

      const text = response.text();
      console.log(text);
     const rat= extractRating(text);

      if (rat >=7) {
        const otheraddress = "0x42791C2Ec3Ff1277899b9c3D5bD4dBd194cFF43F"; // Replace with the actual recipient address
        const amount = 5; // Replace with the actual amount of tokens to transfer
        const tx = await contract.transfer(otheraddress, amount);
        console.log("Good job! Your answer is correct.",rat);
  
        // Delete the SessionQuiz document for this user and quiz
       
      } else {
        console.log("Sorry, your answer is incorrect.");
  
        // Delete the SessionQuiz document for this user and quiz
        
        const domainVerified = await DomainVerified.find({ iduser: "662851410232e012f02d247c" })
         const updateData = {score: domainVerified.score};
        //await DomainVerified.findByIdAndUpdate(id, updateData);
        
      }



      res.status(201).json(text);
  } catch (error) {
      console.log('solve problem error', error);
  }


};


function extractRating(resultString) {
  if (!resultString) {
    return 0; // Handle empty or null input
  }

  const parts = resultString.split(":");
  if (parts.length < 2) {
    return 0; // Handle insufficient parts
  }

  const ratingPart = parts[1];
  const ratingParts = ratingPart.split("/");
  if (ratingParts.length < 2) {
    return 0; // Handle insufficient parts
  }

  const ratingValue = ratingParts[0].trim();
  const rating = parseInt(ratingValue, 10); // Parse using parseInt
  return Number.isNaN(rating) ? 0 : rating; // Handle parsing errors
}

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
