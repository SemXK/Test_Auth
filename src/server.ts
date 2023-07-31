import express from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

//Fundamental constants
const prisma = new PrismaClient()
const server = express()
const PORT = 4000


//HTTP Get Requests
server.get('/', async (req, res) => {
  const dashboards = await prisma.dashboard.findMany({  //Store all 'Dashboard' instances in a variable
    orderBy: {
      position: 'asc'     //Pretty clear
    },
    include: {  //Add contents linked the every instance of 'Dashboard'
      contents: {
        orderBy:{
          position:'desc'
        }
      }    
    }
  }) 
  res.status(200).send({msg: dashboards})
})

//PORT listener
const serverInstance = server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})

process.on('SIGTERM', async () => {           //Launch every time the application is softly rebooted
  console.log('Server going down...');
  serverInstance.close();
  await prisma.$disconnect();      //prevents prisma from locking the disconnection of the application
})