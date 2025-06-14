import express from 'express'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload'
import path from 'path'
import cors from 'cors'
import { createServer } from 'http'
import cron from 'node-cron'
import fs from 'fs'

import { connectDB } from './lib/db.js'
import { initializeSocket } from './lib/socket.js'

import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import adminRoutes from './routes/admin.route.js'
import songRoutes from './routes/song.route.js'
import albumRoutes from './routes/album.route.js'
import statRoutes from './routes/stat.route.js'


dotenv.config()

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT

const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(cors({
  origin: ["https://my-music-v1.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json())
app.use(clerkMiddleware()) // this will add auth to request to obj
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,'tmp'),
    createParentPath:true, // if that tmp folder doesn't exist it creates it
    limits:{
        fileSize: 10 * 1024 * 1024 // 10mb max file size
    }
}
))


// cron jobs
// delete temp files every 24 hours
cron.schedule('0 0 * * *', () => {
    console.log('Running cron job to delete temp files every 24 hours');
    const tempDir = path.join(__dirname, 'tmp');
    fs.readdir(tempDir, (err, files) => {
        if (err) {
            console.error('Error reading temp directory:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error('Error deleting temp file:', err);
                } else {
                    console.log(`Deleted temp file: ${file}`);
                }
            });
        });
    });
});

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/stats', statRoutes)

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

//error handler
app.use((error,req,res,next)=>{
    res.status(500).json({message: process.env.NODE_ENV ==='production'?"Internal server error" : error.message})
})


httpServer.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`)
    connectDB()
})

