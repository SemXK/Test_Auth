import express from 'express'
import  { DashboardService } from './dashboard-service'
import { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import  { hashSync, compareSync } from 'bcrypt'
//Fundamental constants
const auth = express()
const prisma = new PrismaClient()
//HTTP Post requests
auth.post('/login', async (req, res) => {
  const { email, password } = req.body;     //get data
  const user = await prisma.user.findUnique({     //get the user with provided email
    where: {
      email: email
    },
  });
  if(!user) { //User doesnt exist
    return res.status(401).send(`Informations provided are not valid!`)
  }
  if(!compareSync(password, user.passwordHash)) {
    return res.status(401).send(`Informations provided are not valid!`)
  }   //Check if the provided password matches the password of the user, returns a Boolean.
  return res.status(200).send(`Welcome back ${user.name}!`)
});

auth.post('/register', async (req, res) => {
    const { email, password, name } = req.body;       //Prisma automatically checks if the password has already been utilized
    const passwordHash = hashSync(password, 10)
    let user: User;                                    //Create Local variable to use outside the "try" block
    try{
      user = await prisma.user.create({
        data: {
          email:email, 
          name: name,
          passwordHash: passwordHash,
        },
      });
      return res.status(201).send(`User with id :${user.id} has been successfully created!`)
    }catch{
      return res.status(404).send(`Cannot create new user: provided email has been used!`)
    }

});

export { auth }