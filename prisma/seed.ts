import { PrismaClient } from '@prisma/client'

//Fundamental constants
const prisma = new PrismaClient();

//Fundamental functions
async function main() {

  // Create an Instance of 'Dashboard' with 2 'Content' Instances inside
  await prisma.dashboard.create({
    data: {
      name: 'dashboard 1',
      position: 0,
      contents: {
        create: [
          {
            text: 'Prima Task di Trello!',
            position:0,
          },
          {
            text: 'Seconda Task di Trello!',
            position:1,
          }
        ]
      }
    }
  }
);
  // Create an Instance of 'Dashboard' with 2 'Content' Instances inside
  await prisma.dashboard.create({
    data: {
      name: 'dashboard 2',
      position: 1,
      contents: {
        create: [
          {
            text: 'Task 2.1: superare TDS!',
            position:0,
          },
          {
            text: 'Task 2.2: Testo random!',
            position:1,
          }
        ]
      }
    }
  }
  )
}


//By the end of the code, the DB will have 2 'Dashboard instances and 4 'Content' by default
main().then(() => {
  console.log('seed is working fine!')
  process.exit(0)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
