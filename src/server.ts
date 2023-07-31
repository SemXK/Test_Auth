import express from 'express'

//Fundamental constants
const server = express()
const PORT = 4000
//HTTP Get Requests
server.get('/', (req, res) => {
  res.status(200).send({msg: 'server is on home page !'})
})

//POST listener
server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})