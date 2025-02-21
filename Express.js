const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://your-firebase-project.firebaseio.com'
});

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('No token provided');

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token');
    req.userId = decoded.id;
    next();
  });
};

// Generate Digital Key
app.post('/generate-key', verifyToken, async (req, res) => {
  const { bookingId } = req.body;
  const key = jwt.sign({ bookingId }, 'your-secret-key', { expiresIn: '1d' });
  res.json({ key });
});

// Verify Digital Key
app.post('/unlock-room', async (req, res) => {
  const { key } = req.body;
  try {
    const decoded = jwt.verify(key, 'your-secret-key');
    res.json({ success: true, message: 'Door Unlocked!', roomId: decoded.bookingId });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid Key' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
