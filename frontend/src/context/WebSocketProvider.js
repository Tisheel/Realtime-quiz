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

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/room')
        ws.onopen = () => {
            setWs(ws)
        }
    }, [])

    const joinRoom = (room, name) => {

        if (ws.readyState !== 1) {
            toast.error('Somthing went wrong')
            return
        }

        const seed = Math.random()
        ws.send(JSON.stringify({
            event: 'JOIN',
            roomId: room,
            data: {
                name,
                profile: seed
            }
        }))

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

        if (ws.readyState !== 1) {
            toast.error('Somthing went wrong')
            return
        }

        ws.send(JSON.stringify({
            event: "SUBMIT",
            presentationId,
            answerIndex
        }))

    }

    return (
        <WebSocketContext.Provider value={{ ws, joinRoom, submitAnswer, user, room, roomSize, currentState }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider