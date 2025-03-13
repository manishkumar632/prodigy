require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/db');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(dbConfig.uri, dbConfig.options)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Failed to connect to MongoDB", error));

app.use(cors(
    { origin: 'http://localhost:3000' }
)); // Enable CORS

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});