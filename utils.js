import Test from './modals/testModal.js'
import { broadcastAll, createRoom, deleteRoom, joinRoom } from './Room.js'
import { MongooseError } from 'mongoose'
import Analytics from './modals/analyticsModal.js'

export const CreateRoom = async (socket, client, req) => {
    try {
        const test = await Test.findOne({ _id: req?.testId })
        if (!test) {
            return socket.send(JSON.stringify({
                message: 'No Test found'
            }))
        }
        const ppt = {
            id: test?._id,
            questions: test?.questions,
            currentQuestion: -1,
            state: ['NOT_STARTED', 'QUESTION', 'RESULT', 'LEADERBOARD'],
            currentState: 0,
            leaderboard: []
        }
        await client.set(`Presentation:${test?._id}`, JSON.stringify(ppt))
        socket.pptId = test?._id
        createRoom(socket)
    } catch (error) {
        if (error instanceof MongooseError) {
            return socket.send(JSON.stringify({
                message: error.message
            }))
        }
        socket.send(JSON.stringify({
            message: 'Somthing went wrong'
        }))
    }
}

export const Next = async (socket, client) => {
    try {
        let { id, questions, currentQuestion, state, currentState, leaderboard } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
        currentState = (currentState + 1) % state.length
        switch (state[currentState]) {
            case 'NOT_STARTED':
                {
                    const req = {
                        event: "NEXT",
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
                            event: "NEXT",
                            id,
                            state: state[currentState],
                            question: questions[currentQuestion]
                        }
                        broadcastAll(socket, JSON.stringify(res))
                    } else {
                        const res = {
                            event: "NEXT",
                            state: 'FINISHED'
                        }
                        const data = new Analytics({ testId: id, questions, leaderboard })
                        data.save()
                        await client.del(`Presentation:${socket?.pptId}`)
                        broadcastAll(socket, JSON.stringify(res))
                        deleteRoom(socket?.roomId)
                    }
                }
                break
            case 'RESULT':
                {
                    let { questions, currentQuestion } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
                    const question = questions[currentQuestion]
                    const options = []
                    for (let option of question.options) {
                        options.push(option.submissions.length)
                    }
                    question.options = options
                    const res = {
                        event: "NEXT",
                        state: state[currentState],
                        question,
                        answer: questions[currentQuestion].answer
                    }
                    broadcastAll(socket, JSON.stringify(res))
                }
                break
            case 'LEADERBOARD':
                {
                    let { leaderboard } = JSON.parse(await client.get(`Presentation:${socket.pptId}`))
                    const res = {
                        event: "NEXT",
                        state: state[currentState],
                        leaderboard: leaderboard.sort((a, b) => b.score - a.score)
                    }
                    broadcastAll(socket, JSON.stringify(res))
                }
                break
            default:
                break
        }
        await client.set(`Presentation:${socket.pptId}`, JSON.stringify({ id, questions, currentQuestion, state, currentState, leaderboard }))
    } catch (error) {
        console.log(error)
        socket.send(JSON.stringify({
            message: 'Somthing went wrong'
        }))
    }
}

export const Submit = async (socket, client, req) => {
    try {
        let ppt = JSON.parse(await client.get(`Presentation:${req?.presentationId}`))
        let isPresent = false
        ppt.questions[ppt.currentQuestion].options[req?.answerIndex].submissions.push({ id: socket.id, ...socket?.user })

        if (ppt.questions[ppt.currentQuestion].answer === Number(req?.answerIndex)) {
            socket.user.score += 100
            for (let member of ppt.leaderboard) {
                if (member.profile === socket.user.profile) {
                    isPresent = true
                    member.score += 100
                }
            }
            if (!isPresent) {
                ppt.leaderboard.push(socket.user)
            }
        }

        await client.set(`Presentation:${req.presentationId}`, JSON.stringify(ppt))
    } catch (error) {
        socket.send(JSON.stringify({
            message: 'Somthing went wrong'
        }))
    }
}

export const Join = async (socket, req) => {
    try {
        const { name, profile } = req?.data
        socket.user = { name, profile, score: 0 }
        joinRoom(req?.roomId, socket)
    } catch (error) {
        socket.send(JSON.stringify({
            message: 'Somthing went wrong'
        }))
    }
}