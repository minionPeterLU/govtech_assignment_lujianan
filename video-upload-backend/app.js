const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(cors({
  origin: "*",
}),express());

const upload = multer({ dest: 'C://Users//Admin//Desktop//GovTech_Assignment//video-upload-backend//' });
// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ljn@920506',
  database: 'video_collection'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Define your API routes
app.post('/upload', upload.single('file'),(req, res) => {
  let fieldValidStatus = false;
  const videoData = JSON.parse(req.body.data);
  const title = videoData.title;
  const startDate = videoData.startDate;
  const location = videoData.location;
  const file = req.file;

  fieldValidStatus = videoData.title && videoData.startDate && file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log("Debug file: ",file);
  if(fieldValidStatus){
    fs.readFile(file.path, (error, data) => {
      if (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to read file' });
        return;
      }

      var sql = `INSERT INTO videos(video_title,video_start_date,video_location,video_file) 
        VALUES (?,?,?,?)`;
      connection.query(sql,[title,startDate,location,data], function (error) {
        if (error) {
          console.error('Error inserting file data:', error);
          res.status(500).json({ error: 'Failed to store file in MySQL' });
          return;
        }
        console.log("1 record inserted");
        res.send('File uploaded successfully!');
      });
    });
  } else {
    console.log("Debug: Invalid title and startDate");
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

