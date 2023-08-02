import express from 'express'
import  { DashboardService } from './dashboard-service'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'


//Fundamental constants
const prisma = new PrismaClient()
const app = express()      //Main application
const dashboardService = new DashboardService(prisma)   //Call Dashboard class, sending prisma as argument for the constructor


//Middleware
app.use(express.json())
app.use(cors({             //Link BackEnd to FrontEnd
  origin: 'http://localhost:3000'       //use localhost 3000 as the ONLY url who can access these functions
}))


//Trail Functions
const getUser = async () => {
  const user = await prisma.user.findFirst();
  return user!;
}

//HTTP Get Requests
app.get('/', async (req, res) => {           //Get all Dashboards AND 
  const dashboards = await dashboardService.getDashboards()
  res.status(200).send(dashboards)
})

//HTTP Post Requests
app.post('/:dashboardId/move', async(req, res) => {      //Move a Dashboard
  const { position } = req.body;
  const { dashboardId } = req.params
  const user = await getUser()
  const response = dashboardService.moveDashboard(user.id, dashboardId, position)
  if(!response){
    return res.status(404).send(`Cannot move this dashboard!`)
  }
  return res.status(200).send(`Dashboard Moved Successfully`)  
})

app.post('/:dashboardId/:contentId/move', async(req, res) => {     //Move a Content
  const to = req.body;
  const from = req.params
  const user = await getUser()
  const response = dashboardService.moveContent(
    user.id, from.contentId, to.position, from.dashboardId, to.dashboardId
  )
  if(!response){
    return res.status(404).send(`Cannot move this content!`)
  }
  return res.status(200).send(`Content Moved Successfully`)  
})

app.post('/', async (req, res) => {      //Create a new Dashboard
  const { name } =req.body;
  const user = await getUser()
  await dashboardService.createDashboard(user.id, name);
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

app.post('/:dashboardId', async (req, res) => {    //Create a new Content in a specific Dashboard
  const {dashboardId} = req.params
  const { text } =req.body;
  const user = await getUser()
  await dashboardService.createContent(user.id, dashboardId, text);
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})


//HTTP Delete Requests
app.delete('/:dashboardId', async (req, res) => {      //Delete a new Dashboard
  const { dashboardId } =req.params;
  const user = await getUser()
  const result = await dashboardService.deleteDashboard(user.id, dashboardId);   //Which returns true if the Dashboard was deleted
  
  if(!result) {   //CHeck if the dashboard was successfully deleted
    return res.status(404).send(`Dashboard with id: ${dashboardId} was not found :(`)
  }
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

app.delete('/:dashboardId/:contentId', async (req, res) => {      //Delete a new Dashboard
  const { dashboardId, contentId } =req.params;
  const user = await getUser()
  const result = await dashboardService.deleteContent(user.id ,dashboardId, contentId);   //Which returns true if the Dashboard was deleted
  
  if(!result) {   //CHeck if the dashboard was successfully deleted
    return res.status(404).send(`Content with id: ${contentId} was not found :(`)
  }
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

export { app }