import React, { useEffect, useState } from 'react'
import WebSocketContext from './WebSocketContext'
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast'

const WebSocketProvider = ({ children }) => {

    const navigate = useNavigate()

    const [ws, setWs] = useState(null)
    const [user, setUser] = useState(null)
    const [room, setRoom] = useState(null)
    const [roomSize, setRoomSize] = useState(0)
    const [currentState, setCurrentState] = useState(null)

    const joinRoom = (room, name) => {

        const ws = new WebSocket('/room')

        ws.onerror = () => {
            toast.error('Error connecting to web socket')
        }

        const seed = Math.random()

        ws.onopen = () => {
            setWs(ws)

            ws.send(JSON.stringify({
                event: 'JOIN',
                roomId: room,
                data: {
                    name,
                    profile: seed
                }
            }))
        }

        ws.onmessage = (e) => {
            const res = JSON.parse(e.data)
            switch (res.event) {
                case "ROOM_JOINED_SUCCESS":
                    setUser({ name, profile: seed })
                    setRoom(room)
                    setCurrentState({ state: "NOT_STARTED" })
                    navigate(`/${room}/not_started`)
                    toast.success('Room Joined Successfully')
                    break
                case "ROOM_JOINED_FAIL":
                    toast.error(res.data)
                    break
                case "ROOM_SIZE":
                    setRoomSize(res.size)
                    break
                case "NEXT":
                    switch (res.state) {
                        case "NOT_STARTED":
                            navigate(`/${room}/not_started`)
                            break
                        case "QUESTION":
                            navigate(`/${room}/question`)
                            break
                        case "RESULT":
                            navigate(`/${room}/result`)
                            break
                        case "LEADERBOARD":
                            navigate(`/${room}/leaderboard`)
                            break
                        case "FINISH":
                            navigate(`/`)
                            toast.success('Test Completed!!!')
                            break
                        default:
                            navigate('/')
                            break
                    }
                    setCurrentState(res)
                    break
            }
        }

    }

    const streamTest = (testId) => {

        const ws = new WebSocket(`/teacher?token=${sessionStorage.getItem('token')}`)

        ws.onerror = () => {
            toast.error('Error connecting to web socket')
        }

        ws.onopen = () => {
            setWs(ws)

            ws.send(JSON.stringify({
                event: "CREATE_ROOM",
                testId
            }))

        }

        const seed = Math.random()

        ws.onmessage = async (e) => {
            const res = await JSON.parse(e.data)
            switch (res.event) {
                case "ROOM_ID":
                    setRoom(res.roomId)
                    setUser({ name: "Host", profile: seed })
                    setCurrentState({ state: "NOT_STARTED" })
                    navigate(`/${res.roomId}/not_started`)
                    toast.success('Room Joined Successfully')
                    break
                case "ROOM_SIZE":
                    setRoomSize(res.size)
                    break
                case "NEXT":
                    switch (res.state) {
                        case "NOT_STARTED":
                            navigate(`/${res.roomId}/not_started`)
                            break
                        case "QUESTION":
                            navigate(`/${res.roomId}/question`)
                            break
                        case "RESULT":
                            navigate(`/${res.roomId}/result`)
                            break
                        case "LEADERBOARD":
                            navigate(`/${res.roomId}/leaderboard`)
                            break
                        case "FINISH":
                            navigate(`/`)
                            toast.success('Test Completed!!!')
                            break
                        default:
                            navigate('/')
                            break
                    }
                    setCurrentState(res)
                    break
            }
        }

    }

    const submitAnswer = (presentationId, answerIndex) => {

        if (ws?.readyState !== 1) {
            toast.error('Somthing went wrong')
            return
        }

        ws.send(JSON.stringify({
            event: "SUBMIT",
            presentationId,
            answerIndex
        }))

    }

    const next = () => {

        if (ws?.readyState !== 1) {
            toast.error('Somthing went wrong')
            return
        }

        ws.send(JSON.stringify({
            event: "NEXT"
        }))

    }

    return (
        <WebSocketContext.Provider value={{ ws, joinRoom, submitAnswer, user, room, roomSize, currentState, setWs, streamTest, next }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider