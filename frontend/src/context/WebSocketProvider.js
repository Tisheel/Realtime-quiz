import React, { useEffect, useState } from 'react'
import WebSocketContext from './WebSocketContext'
import toast from 'react-hot-toast'

const WebSocketProvider = ({ children }) => {

    const [ws, setWs] = useState(null)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/room')
        ws.onopen = () => {
            setWs(ws)
        }
    }, [])

    if (ws !== null) {
        ws.onmessage = (e) => {
            toast(e.data)
        }
    }

    return (
        <WebSocketContext.Provider value={{ ws }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider