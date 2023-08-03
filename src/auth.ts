import express from 'express'
import  { DashboardService } from './dashboard-service'
import { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import  { hashSync, compareSync } from 'bcrypt'
import { getJwtKeys } from './key'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
//Fundamental constants
const auth = express()
const prisma = new PrismaClient()

//Fundamental constants (verifying informations, getting jwt keys, calculating exp dates)
async function verifyEmailAndPassword(email: string, password: string): Promise <User | null> {
  const user = await prisma.user.findUnique({     //get the user with provided email
    where: {
      email: email
    },
  });
  if(!user) {     //User exists?
    return null
  }
  if(!compareSync(password, user.passwordHash)) { //provided pass = user's actual pass ? 
    return null
  }  
  return user
}

async function generateJwt(user: User): Promise<string> {
  const payload = {        //create presonal key for user
    aud: 'access',
    exp: getExpTime(2 * 60),    //expires in 2 hours
    id: user.id,
    email: user.email
  };
  const { privateKey } = await getJwtKeys()   //obtain users private key
  return jwt.sign(payload, privateKey, {algorithm: 'RS256'})      //encode and sign users key
}

function getExpTime(min: number) {
  const now = Math.trunc(new Date().getTime() /1000)
  return now + min * 60
}
//HTTP Post requests
auth.post('/login',   //Login w/ email & pass, generate a jwt
  body('email').isEmail(),        //Function's parameter
  body('password').isString(),    //Function's parameter
  async (req, res) => {           //Function's parameter

    const errors = validationResult(req)      //Validate provided info
    if(!errors.isEmpty()) {
      return res.status(404).send({errors})
    }
    const { email, password } = req.body;     //get data
    const user = await verifyEmailAndPassword(email, password)
    if(!user) {     //User exists?
      return res.status(404).send(`Invalid credentials!`)
    }
    const token = await generateJwt(user)   
    return res.status(200).send({accessToken: token})   //give the user his private key
});

auth.post('/register',                 //Create a new user
  body('email').isEmail(),             //Function's parameter
  body('password').isLength({min: 8}),        //Function's parameter
  body('name').isString(),        //Function's parameter
  async (req, res) => {               //Function's parameter
    
    
    const errors = validationResult(req)      //Validate provided info
    if(!errors.isEmpty()) {
      return res.status(404).send({errors})
    }
    const { email, password, name } = req.body;       //Prisma automatically checks if the email has already been utilized
    const passwordHash = hashSync(password, 10)
    let user: User;                                    //Create Local variable to use outside "try" block
    
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