require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const doctorRoute = require('./routes/doctor');
const plannerRoute = require('./routes/planner');


const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/doctors', doctorRoute);
app.use('/api/transactions', transactionRoutes);
app.use('/api/planner', plannerRoute); 
// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/auth', authRoutes);

// Define port
const PORT = process.env.PORT || 8000;

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    // Only start the server after successful DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});