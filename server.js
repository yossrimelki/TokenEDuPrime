const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const AdminRoute = require('./routes/admin');
const AuthRoute = require('./routes/auth');
const QuizRoute = require('./routes/Quiz'); // Import QuizRoute

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
app.use(morgan('dev'));
app.use(express.json()); // Replace bodyParser with built-in express.json() middleware
app.use(express.urlencoded({ extended: true })); // You can remove this line if you're not using URL-encoded bodies
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// Define routes
app.use('/api/admin', AdminRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/quiz', QuizRoute); // Use a separate base path for QuizRoute
