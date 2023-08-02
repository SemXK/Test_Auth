import { generateKeyPairSync } from "crypto";
import { PrismaClient } from "@prisma/client";
export interface JwtKeys {
  privateKey: string;
  publicKey: string
}
//Fundamental constants
const prisma = new PrismaClient()


function generateKeys(): JwtKeys {
  const keys = generateKeyPairSync('rsa', {       //Create a pair of keys, used by users to login
    modulusLength: 4096,
    publicKeyEncoding:  {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type:'pkcs8',
      format: 'pem',
    },
  });
  return keys
} 

export async function getJwtKeys(): Promise <JwtKeys> {
  let keys = await prisma.jwtKey.findFirst()          //see if keys are existing
  const { privateKey, publicKey} = generateKeys()     //generate a pair of secret Keys,
  if(!keys) {
    keys = await prisma.jwtKey.create({   //Use the keys to create an instance of "JwtKeys"
      data: {
        privateKey,   //use private key as "private key"
        publicKey     //use public key as "public key"
      },
    });
  };
  return { privateKey, publicKey}       //return generated / existing keys

}