import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import url from 'url'
import { createClient } from 'redis'
import { leaveRoom } from './Room.js'
import connectToMongoDB from './MongoDB.js'
import dotenv from 'dotenv'
import testRouter from './router/testRouter.js'
import { CreateRoom, Join, Next, Submit } from './utils.js'

// Configure .env
dotenv.config()

// Globals
const PORT = 3001
const HOST = '127.0.0.1'

// Servers Instances
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Redis Client
const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect()

// MongoDB
await connectToMongoDB(process.env.MONGO_URL, 'Test')

// Middlewares
app.use(express.json())
app.use('/v1', testRouter)

wss.on('connection', (socket, req) => {

    const { pathname } = url.parse(req.url, true)

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id} [${wss.clients.size}]`)

    switch (pathname) {
        case '/teacher':
            socket.on('message', (data) => {
                const req = JSON.parse(data.toString())
                    ; (async () => {
                        switch (req.event) {
                            case 'CREATE_ROOM':
                                CreateRoom(socket, client, req)
                                break

                            case 'NEXT':
                                Next(socket, client)
                                break

                            default:
                                socket.send(JOSN.stringify({
                                    event: 'INVALID_EVENT'
                                }))
                                break
                        }
                    })()
            })
            break

        case '/room':
            socket.on('message', (data) => {
                const req = JSON.parse(data.toString());
                (async () => {
                    switch (req?.event) {
                        case 'JOIN':
                            Join(socket, req)
                            break
                        case 'SUBMIT':
                            Submit(socket, client, req)
                            break
                        default:
                            socket.send(JOSN.stringify({
                                event: 'INVALID_EVENT'
                            }))
                            break
                    }
                })()
            })
            break

        default:
            socket.close()
            break
    }

    socket.on('close', () => {
        console.log(`Disconnected: ${socket?.id} [${wss.clients.size}]`)
        if (socket?.roomId) {
            leaveRoom(socket)
        }
    })

})

server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})

// Socket
// --id
// --?roomId
// --?pptId
// --user
//    {
//     --name
//     --profile
//     --score
//    }


// Room
// --set of socket

// TODO
// implement Map of socket ???
// broadcast
// figure out ans submission
// score and leader board
// admin for room
// wat shd happen when admin leaves