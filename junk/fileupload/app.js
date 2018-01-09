const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  const sampleFile = req.files.sampleFile;
  fs.writeFile(path.join(__dirname, `/upload/`, sampleFile.name), sampleFile.data, (err) => res.json({err}));
});

app.listen(3000, err => console.log('Server up on port 3000'));