import express from 'express'
import cors from 'cors';
import { app } from './app';
import { auth } from './auth';
//Fundamental constants
const server = express()
const PORT = 4000


//Middleware
server.use(express.json())    //Global actiovation of json for http requests
server.use(cors({             //Link BackEnd to FrontEnd
  origin: 'http://localhost:3000'       //use localhost 3000 as the ONLY url who can access these functions
}))
server.use('/app', app)     //uses app.ts as sub-application for route '/app'
server.use('/auth', auth)

//PORT listener
server.listen(PORT, () => {       //serverInstance
  console.log(`Server is listening on port: ${PORT}`)
})

// process.on('SIGTERM', async () => {           //Launch every time the application is softly rebooted
//   console.log('Server going down...');
//   serverInstance.close();
//   await prisma.$disconnect();      //prevents prisma from locking the disconnection of the application
// }) 