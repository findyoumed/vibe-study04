require('dotenv').config(); // [LOG: 20260331_1505] - Load environment variables
const dns = require('node:dns'); // [LOG: 20260331_1537] - Fix for Atlas DNS querySrv error
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // [LOG: 20260331_1037] - Added Mongoose
const app = express();
const PORT = process.env.PORT || 5000; // [LOG: 20260331_1459] - Changed back to 5000 as per user request

app.use(cors());
app.use(express.json());

// [LOG: 20260331_1041] - Request Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// [LOG: 20260331_1048] - Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running and healthy!');
});

// [LOG: 20260331_1551] - MongoDB Atlas Connection with Debugging
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI is not defined in environment variables!');
} else {
    // Mask password for safety: mongodb+srv://user:pass@host -> mongodb+srv://user:****@host
    const maskedUri = mongoUri.replace(/(:\/\/.*:)(.*)(@)/, '$1****$3');
    console.log('Attempting to connect to MongoDB:', maskedUri);
}

mongoose.connect(mongoUri || 'mongodb://localhost:27017/todoapp')
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch(err => {
        console.error('Detailed MongoDB connection error:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
    });

// [LOG: 20260331_1142] - Use modularized Todo model
const Todo = require('./models/Todo');

// [LOG: 20260331_1145] - Connect modularized router
const todoRouter = require('./routers/todoRouter');
app.use('/todos', todoRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

