const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('API is working!!');
});

// Sample POST endpoint
app.post('/data', (req, res) => {
  const receivedData = req.body;
  res.json({ message: 'Data received!', data: receivedData });
});

app.listen(port, () => {
  console.log(`API service running at http://localhost:${port}`);
});
