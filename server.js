const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serves index.html at / and register/index.html at /register
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
