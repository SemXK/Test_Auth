import express from 'express'
import { PrismaClient } from '@prisma/client'
import { DashboardService } from './dashboard'

//Fundamental constants
const prisma = new PrismaClient()
const server = express()
const PORT = 4000
const dashboardService = new DashboardService(prisma)   //Call Dashboard class, sending prisma as argument for the constructor
//Middleware
server.use(express.json())

//HTTP Get Requests
server.get('/', async (req, res) => {
  const dashboards = await dashboardService.getDashboards()
  res.status(200).send({msg: dashboards})
})

//HTTP Post Requests
server.post('/:dashboardId/move', async(req, res) => {
  const { position } = req.body;
  const { dashboardId } = req.params
  const response = dashboardService.moveDashboard(dashboardId, position)
  if(!response){
    return res.status(404).send(`Cannot move this dashboard!`)
  }
  return res.status(200).send(`Dashboard Moved Successfully`)  
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