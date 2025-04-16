import express, { urlencoded } from 'express'
import http, { createServer } from 'node:http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import chalk from 'chalk'
dotenv.config()

import connectToDb from './configs/database.config.js'
import connectToSocket from './configs/socket.config.js'
import userRouter from './routes/user.routes.js'

const PORT = process.env.SERVER_PORT || 8000
const app = express()

const server = createServer(app)
const io = connectToSocket(server)

app.use(express.json({limit:'40kb'})) // limit controls size of payload
app.use(urlencoded({limit:'40kb', extended:true}))


// CORS configuration
const allowedOrigins = ["http://localhost:3000" , "http://localhost:8000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));


// routes
app.use('/api/v1/user',userRouter)




connectToDb().then(()=>{
    console.log(chalk.bgMagenta('Connected to MongoDB Database successfully ✅ ✅ '))
    server.listen(PORT,()=>{
        console.log(chalk.bgGreenBright(`🚀 Server is listening at http://localhost:${PORT}`))
    })
}).catch((error)=>{
    console.error(chalk.bgRed('❌Error in connecting to MongoDB Database :'+ error.message))
    process.exit(1)  // exit the process with an error status code 1
})