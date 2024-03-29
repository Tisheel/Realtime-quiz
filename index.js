import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import url, { fileURLToPath } from 'url'
import { createClient } from 'redis'
import { leaveRoom } from './Room.js'
import connectToMongoDB from './MongoDB.js'
import dotenv from 'dotenv'
import testRouter from './router/testRouter.js'
import teacherRouter from './router/teacherRouter.js'
import { CreateRoom, Join, Next, Submit } from './utils.js'
import Teacher from './modals/teacherModal.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import path from 'path'

// Configure .env
dotenv.config()

// Globals
const PORT = 3001
const HOST = '127.0.0.1'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Servers Instances
const app = express()
const server = createServer(app)
const wssTeacher = new WebSocketServer({ noServer: true })
const wssRoom = new WebSocketServer({ noServer: true })

// Redis Client
const client = await createClient({ url: process.env.REDIS_URL })
    .on('error', err => console.log('Redis Client Error', err))
    .connect()

// MongoDB
await connectToMongoDB(process.env.MONGO_URL, 'Test')

// Middlewares
app.use(express.json())
app.use(cors())
app.use('/v1', testRouter)
app.use('/v1', teacherRouter)

app.use(express.static(path.join(__dirname, 'frontend', 'build')))
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})
app.get('*', function (req, res) {
    res.status(404).send('Page not found go back to <a href="/">home</a>')
})

server.on('upgrade', async (request, socket, head) => {

    const { pathname, query } = url.parse(request.url, true)

    if (pathname === '/teacher') {

        try {

            const { token } = query

            if (!token) {

                socket.write('HTTP/1.1 400 No Token\r\n\r\n')
                socket.destroy()
                return

            }

            const { _id } = jwt.verify(token, '1234567')

            const teacher = await Teacher.findOne({ _id })

            if (!teacher) {

                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
                socket.destroy()
                return

            }

            wssTeacher.handleUpgrade(request, socket, head, (ws) => {

                wssTeacher.emit('connection', ws, request)

            })

        } catch (error) {

            console.log(error)

            socket.write('HTTP/1.1 500 Somthing went wrong\r\n\r\n')
            socket.destroy()

        }

    } else if (pathname === '/room') {

        wssRoom.handleUpgrade(request, socket, head, (ws) => {

            wssRoom.emit('connection', ws, request)

        })

    } else {

        socket.destroy()

    }

})


wssTeacher.on('connection', (socket, req) => {

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id} [${wssTeacher.clients.size}]`)

    socket.on('message', async (data) => {

        const req = JSON.parse(data.toString())

            ; (async () => {
                switch (req?.event) {
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

    socket.on('close', () => {
        console.log(`Disconnected: ${socket?.id} [${wssTeacher.clients.size}]`)
        if (socket?.roomId) {
            leaveRoom(socket)
        }
    })

})

wssRoom.on('connection', (socket, req) => {

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id} [${wssRoom.clients.size}]`)

    socket.on('message', (data) => {

        const req = JSON.parse(data.toString())

            ; (async () => {
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

    socket.on('close', () => {
        console.log(`Disconnected: ${socket?.id} [${wssRoom.clients.size}]`)
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