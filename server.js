const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Serve case study pages
app.get('/case-study/:project', (req, res) => {
  const file = path.join(__dirname, 'case-studies', `${req.params.project}.html`);
  res.sendFile(file, (err) => {
    if (err) res.status(404).sendFile(path.join(__dirname, 'index.html'));
  });
});

// All other routes serve index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio running on port ${PORT}`);
});
