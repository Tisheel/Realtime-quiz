import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import url from 'url'
import { createClient } from 'redis'
import { broadcast, broadcastAll, createRoom, getRoom, getRoomMembers, joinRoom, leaveRoom } from './Room.js'

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
        const test = await client.set(`Test:${id}`, JSON.stringify({ id, title, questions }))
        if (test) {
            return res.status(200).json({
                message: 'ok',
                test: { id, title, questions }
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
                        case 'CREATE_ROOM':
                            {
                                const { id, questions } = JSON.parse(await client.get(`Test:${req.testId}`))
                                const ppt = {
                                    id,
                                    questions,
                                    currentQuestion: -1,
                                    state: ['NOT_STARTED', 'QUESTION', 'RESULT', 'LEADERBOARD'],
                                    currentState: 0,
                                    leaderboard: []
                                }
                                await client.set(`Presentation:${id}`, JSON.stringify(ppt))
                                socket.pptId = id
                                createRoom(socket)
                            }
                            break

                        case 'NEXT':
                            {
                                let { id, questions, currentQuestion, state, currentState, leaderboard } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
                                currentState = (currentState + 1) % state.length
                                switch (state[currentState]) {
                                    case 'NOT_STARTED':
                                        {
                                            const req = {
                                                state: state[currentState]
                                            }
                                            broadcastAll(socket, JSON.stringify(req))
                                        }
                                        break
                                    case 'QUESTION':
                                        {
                                            currentQuestion++
                                            if (currentQuestion < questions.length) {
                                                const res = {
                                                    id,
                                                    state: state[currentState],
                                                    question: questions[currentQuestion]
                                                }
                                                broadcastAll(socket, JSON.stringify(res))
                                            } else {
                                                const res = {
                                                    state: 'FINISHED'
                                                }
                                                broadcastAll(socket, JSON.stringify(res))
                                            }
                                        }
                                        break
                                    case 'RESULT':
                                        {
                                            let { questions, currentQuestion } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
                                            const res = {
                                                state: state[currentState],
                                                options: [],
                                                answer: questions[currentQuestion].answer
                                            }
                                            const members = getRoom(socket.roomId).size
                                            for (let option of questions[currentQuestion].options) {
                                                res.options.push((option.submissions.length) / members)
                                            }
                                            broadcastAll(socket, JSON.stringify(res))
                                        }
                                        break
                                    case 'LEADERBOARD':
                                        {
                                            let { leaderboard } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
                                            const res = {
                                                state: state[currentState],
                                                leaderboard
                                            }
                                            broadcastAll(socket, JSON.stringify(res))
                                        }
                                        break
                                    default:
                                        break
                                }
                                await client.set(`Presentation:${socket.pptId}`, JSON.stringify({ id, questions, currentQuestion, state, currentState, leaderboard }))
                            }
                            break

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
                            {
                                const { name, profile } = req.data
                                socket.user = { name, profile, score: 0 }
                                joinRoom(req.roomId, socket)
                            }
                            break
                        case 'SUBMIT':
                            {
                                let ppt = JSON.parse(await client.get(`Presentation:${req.presentationId}`))

                                ppt.questions[ppt.currentQuestion].options[req.answerIndex].submissions.push({ id: socket.id, ...socket.user })

                                if (ppt.questions[ppt.currentQuestion].answer === req.answerIndex) {
                                    socket.user.score += 100
                                    ppt.leaderboard.push(socket.user)
                                }

                                await client.set(`Presentation:${req.presentationId}`, JSON.stringify(ppt))
                            }
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
// --?pptId
// --user
//    {
//     --name
//     --profile
//     --score
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