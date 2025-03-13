const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    // only send user email and username
    const { username, email: userEmail } = user;
    res.status(200).send({ username, email: userEmail, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
