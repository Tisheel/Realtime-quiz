import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import url from 'url'
import { createClient } from 'redis'
import { broadcast, createRoom, getRoomMembers, joinRoom, leaveRoom } from './Room.js'

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

wss.clients

// Middlewares
app.use(express.json())

app.post('/test', async (req, res) => {
    try {
        const { title, questions } = req.body
        const id = uuidv4()
        for (let question of questions) {
            question.id = uuidv4()
        }
        console.log({ id, title, questions })
        const test = await client.set(`Test:${id}`, JSON.stringify({ id, title, questions }))
        if (test) {
            return res.status(200).json({
                message: 'ok'
            })
        }
        res.status(400).json({
            message: 'Somthing went wrong'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Somthing went wrong'
        })
    }
})

wss.on('connection', (socket, req) => {

    const { pathname } = url.parse(req.url, true)

    socket.id = uuidv4()
    console.log(`Connected: ${socket.id} [${wss.clients.size}]`)

    switch (pathname) {
        case '/teacher':
            socket.on('message', (data) => {
                const req = JSON.parse(data.toString());
                (async () => {
                    switch (req.event) {
                        case 'START':
                            {
                                const { id, questions } = JSON.parse(await client.get(`Test:${req.presentationId}`))
                                const ppt = {
                                    id,
                                    questions,
                                    currentQuestion: -1,
                                    state: ['NOT_STARTED', 'QUESTION', 'RESULT', 'LEADERBOARD'],
                                    currentState: 0,
                                    leaderboard: []
                                }
                                await client.set(`Presentation:${id}`, JSON.stringify(ppt))
                                createRoom(socket)
                                const res = {
                                    state: ppt.state[ppt.currentState]
                                }
                                broadcast(socket, JSON.stringify(res))
                                break
                            }

                        case 'NEXT':
                            {
                                const { questions, currentQuestion, state, currentState, leaderboard } = JSON.parse(await client.get(`Presentation:${req.presentationId}`))
                                currentState = (currentState + 1) % 4
                                switch (state[currentState]) {
                                    case 'QUESTION':
                                        {
                                            currentQuestion++
                                            if (currentQuestion < questions.length) {
                                                const res = {
                                                    state: state[currentState],
                                                    question: questions[currentQuestion]
                                                }
                                                broadcast(socket, JSON.stringify(res))
                                            } else {
                                                const res = {
                                                    state: 'FINISHED'
                                                }
                                                broadcast(socket, JSON.stringify(res))
                                            }
                                            break
                                        }

                                    default:
                                        break
                                }
                            }

                        default:
                            break
                    }
                })()
            })
            break

        case '/room':
            socket.on('message', (data) => {
                const req = JSON.parse(data.toString());
                (async () => {
                    switch (req.event) {
                        case 'JOIN':
                            const { name, profile } = req.data
                            socket.user = { name, profile }
                            joinRoom(req.roomId, socket)
                            break

                        default:
                            break
                    }
                })()
            })
            break

        default:
            break
    }

    socket.on('close', () => {
        console.log(`Disconnected: ${socket.id} [${wss.clients.size}]`)
        if (socket.roomId) {
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
// --user
//    {
//     --name
//     --profile
//    }


// Room
// --set of socket ids

// TODO
// implement Map of socket ???
// broadcast
// figure out ans submission
// score and leader board
// admin for room
// wat shd happen when admin leaves