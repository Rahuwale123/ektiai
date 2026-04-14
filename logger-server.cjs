const express = require('express');
const app = express();
const port = 3001;

// Manual CORS middleware since 'cors' package is not installed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.post('/log', (req, res) => {
  const { message, type = 'info', context = 'APP' } = req.body;
  const timestamp = new Date().toLocaleTimeString();
  
  const colors = {
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    gemini: '\x1b[35m', // Magenta
    reset: '\x1b[0m'
  };

  const color = colors[type] || colors.info;
  const tag = `[${context}]`.padEnd(10);
  
  console.log(`${timestamp} ${color}${tag}${colors.reset} ${message}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`\x1b[32m[SERVER] Terminal Logger active on port ${port}\x1b[0m`);
});
