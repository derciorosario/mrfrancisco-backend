require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const fs=require('fs')
require('./config/connectDB')();
const CronJob = require('cron').CronJob;

const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const folderPath = path.join(__dirname, 'uploads');
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});




app.get('/audio/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Validate filename to prevent directory traversal
    if (!/^[a-zA-Z0-9\-_\.]+$/.test(filename)) {
      return res.status(400).send('Invalid filename');
    }
    
    const filePath = path.join(folderPath, filename);
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).send('File not found');
        }
        return res.status(500).send('Server error');
      }
      
      // Set proper headers for audio
      res.set({
        'Content-Type': 'audio/mpeg', // Adjust based on your audio format
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes'
      });
      
      // Create read stream
      const stream = fs.createReadStream(filePath);
      
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          return res.status(500).send('Stream error');
        }
      });
      
      stream.pipe(res);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('Server error');
  }
});


const BackUpJob = new CronJob('*/1 * * * *', () => {
  console.log('Running backup...');
  backupFolders()
}, null, true, 'UTC'); 

BackUpJob.start()


let upload_file_path=path.join(__dirname,'/uploads')
let backupAndRestoreFolder=path.join(__dirname,'../nejps-backup-folder')
let defaultFolders=[
    upload_file_path,
    backupAndRestoreFolder
]
  
function createDefaultFolders(){
       defaultFolders.forEach(i=>{
          if (!fs.existsSync(i)) {
            fs.mkdirSync(i, { recursive: true });
            console.log(`Folder created at ${i}`)
          } else {
            console.log(`Folder already exists at ${i}`)
          }
       })
}

const { login } = require('./controllers/user');
const User = require('./models/user');
app.post('/login', login);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ " - " +Math.random() + '-' + file.originalname); 
    }
});

const apiRoute = require('./routes/api');
const { backupFolders } = require('./backup-and-restore');
app.use('/api', apiRoute)

app.get('/api/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '/uploads/', fileName); 
  
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
  
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream', 
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename=${fileName}`,
      });
  
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } else {
      res.status(404).send('File not found');
    }
  })




// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    createDefaultFolders()
});


