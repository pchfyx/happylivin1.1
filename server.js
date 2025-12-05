const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve CSS files
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve JS files with correct MIME type
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes by serving index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Happy Living Kost Management System is running!`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🏠 Environment: ${process.env.NODE_ENV || 'development'}`);
});