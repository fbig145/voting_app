const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors()); // Use CORS here before your routes

const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');

app.use('/api/user', authRoutes);
app.use('/api/polls', pollRoutes);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB!'))
    .catch(err => console.error('Connection error', err));

app.listen(3000, () => console.log('Server Up and running'));
