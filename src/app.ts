import express from 'express'
import  { DashboardService } from './dashboard-service'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { getJwtKeys } from './key'
import  jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
//Fundamental constants
const prisma = new PrismaClient()
const app = express()      //Main application
const dashboardService = new DashboardService(prisma)   //Call Dashboard class, sending prisma as argument for the constructor

//Fundamental constants(Token Regex)
async function verifyToken(header: string | undefined): Promise<string | null>{
  if(!header){
    return null
  }

  const match = /Bearer (.+)/.exec(header);    //Check the token structure
  if(!match) {
    return null
  }

  const token = match[1]
  const { publicKey } = await getJwtKeys();     //Get public key

  try{
    console.log('token: ', token)
    const data = jwt.verify(token, publicKey, {     //Check if token and public key are equal
      algorithms: ['RS256']
    }) as { id: string }
    console.log('shit')
    return data.id        //return user with the provided public key
  } catch {
    return null
  }
}

//Middleware
app.use(express.json())
app.use(cors({             //Link BackEnd to FrontEnd
  origin: 'http://localhost:3000'       //use localhost 3000 as the ONLY url who can access these functions
}))
app.use(async (req, res, next) => {       //Verify Token before any render
  const authHeader = req.headers['authorization']
  const userId = await verifyToken(authHeader);

  if(!userId) {
    return res.status(400).send(`Invalid credentials!`)
  }
  res.locals.usedId = userId

  next();
});

//HTTP Get Requests
app.get('/', async (req, res) => {           //Get all Dashboards AND 
  const dashboards = await dashboardService.getDashboards()
  res.status(200).send(dashboards)
})

//HTTP Post Requests
app.post('/:dashboardId/move', body('position').isInt(), async(req, res) => {      //Move a Dashboard

  
  const errors = validationResult(req) //Validate current position
  if(!errors.isEmpty()) {
    return res.status(404).send({errors})
  } 
  const { position } = req.body;
  const { dashboardId } = req.params!;
  const userId = res.locals.userId;
  const response = dashboardService.moveDashboard(userId, dashboardId, position);
  if(!response){
    return res.status(404).send(`Cannot move this dashboard!`)
  };
  return res.status(200).send(`Dashboard Moved Successfully`)  
});

app.post('/:dashboardId/:contentId/move',     //Move a Content
  body('dashboardId').isString(),
  body('position').isInt(),
  async(req, res) => {     

    const errors = validationResult(req)      //Validate provided info
    if(!errors.isEmpty()) {
      return res.status(404).send({errors})
    }
    const to = req.body as { position: number, dashboardId:string};
    const from = req.params!
    const userId = res.locals.userId
    const response = dashboardService.moveContent(
      userId, from.contentId, to.position, from.dashboardId, to.dashboardId
    )
    if(!response){
      return res.status(404).send(`Cannot move this content!`)
    }
    return res.status(200).send(`Content Moved Successfully`)  
  })

app.post('/', body('name').isString(), async (req, res) => {      //Create a new Dashboard
  const { name } =req.body;
  const userId = res.locals.userId
  await dashboardService.createDashboard(userId, name);
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

app.post('/:dashboardId', body('text').isString, async (req, res) => {    //Create a new Content in a specific Dashboard
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(404).send({errors})
  }
  const {dashboardId} = req.params!
  const { text } =req.body;
  const userId = res.locals.userId
  await dashboardService.createContent(userId, dashboardId, text);
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

//HTTP Delete Requests
app.delete('/:dashboardId', async (req, res) => {      //Delete a Dashboard
  const { dashboardId } =req.params;
  const userId = res.locals.userId
  const result = await dashboardService.deleteDashboard(userId, dashboardId);   //Which returns true if the Dashboard was deleted
  
  if(!result) {   //CHeck if the dashboard was successfully deleted
    return res.status(404).send(`Dashboard with id: ${dashboardId} was not found :(`)
  }
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

app.delete('/:dashboardId/:contentId', async (req, res) => {      //Delete a Content
  const { dashboardId, contentId } =req.params;
  const userId = res.locals.userId
  const result = await dashboardService.deleteContent(userId,dashboardId, contentId);   //Which returns true if the Dashboard was deleted
  
  if(!result) {   //CHeck if the dashboard was successfully deleted
    return res.status(404).send(`Content with id: ${contentId} was not found :(`)
  }
  const dashboards = await dashboardService.getDashboards();
  return res.status(200).send(dashboards);
})

export { app }