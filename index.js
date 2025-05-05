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

const BackUpJob = new CronJob('*/55 * * * *', () => {
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


