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

  if(!keys) {
    const { privateKey, publicKey} = generateKeys()     //generate a pair of secret Keys,
    keys = await prisma.jwtKey.create({   //Use the keys to create an instance of "JwtKeys"
      data: {
        privateKey: privateKey,   //use private key as "private key"
        publicKey: publicKey     //use public key as "public key"
      },
    });
  };
  return {publicKey: keys.publicKey, privateKey: keys.privateKey}      //return generated / existing keys

}