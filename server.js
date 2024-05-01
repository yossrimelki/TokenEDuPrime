const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const contract = require('./models/cont.js');


/////////////////////////////////////////////////////////
//==============================================================
async function isInitialized() {
   try {
     const initialized = await contract.isInitialized();
     return initialized;
   } catch (error) {
     console.error("Error checking contract initialization:", error);
     throw error; // It's usually a good idea to rethrow the error after logging it.
   }
 }
 
 async function tryInitialize() {
   try {
     const initialized = await isInitialized();
     if (!initialized) {
       // Assuming initialize() doesn't require arguments for simplicity; adjust as needed.
       const initializeTx = await contract.initialize("EduToken", "EduT", 18);
       const receipt = await initializeTx.wait();
 
       // Log the entire receipt to inspect events and status
       console.log("Transaction receipt:", receipt);
 
       // Check if transaction was successful based on receipt; adjust condition as necessary
       if (receipt.status === 1) {
         console.log("Contract initialized successfully.");
       } else {
         console.log("Initialization failed.");
       }
     } else {
       console.log("Contract is already initialized.");
     }
   } catch (error) {
     console.error("Error during initialization:", error);
   }
 }

/////////////////////////////////////////////////////////


const AuthRoute = require('./routes/auth.js');
const userRoute = require("./routes/userRoute.js");
const QuizRoute = require('./routes/Quiz'); // Import QuizRoute
const coursRoutes = require('./routes/coursRoutes.js');
const cartRoutes = require ('./routes/cartRoutes.js');
const domainRoutes = require ('./routes/Domain.js');

mongoose.connect('mongodb://127.0.0.1:27017/pdmDB', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
   console.error('Database connection error:', err);
});

db.once('open', () => {
   console.log('Database Connection Established!');
});

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Replace bodyParser with built-in express.json() middleware
app.use(express.urlencoded({ extended: true })); // You can remove this line if you're not using URL-encoded bodies
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

app.get('/balance/:account', async (req, res) => {
  const account = req.params.account;
  try {
    const balance = await contract.balanceOf(account);
    const plainBalance = await balance.toNumber(); // Wait for the Promise to resolve before calling toNumber()
    res.json({ balance: plainBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Define routes
app.use('/api/auth', AuthRoute);
app.use('/api/quiz', QuizRoute); // Use a separate base path for QuizRouteapp.use('/cours', coursRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/domain', domainRoutes);
app.use('/user', userRoute);


async function main() {
   try {
      await tryInitialize();
   } catch (error) {
      console.error("Error in main function:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));
    }

}
main().catch((err) => console.error(err));