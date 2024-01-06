import { WebSocket } from 'ws'

const Rooms = new Map()

export const createRoom = (socket) => {
    const roomId = String(Math.floor(10000000 + Math.random() * 10000000))
    const room = new Set()
    room.add(socket)
    socket.roomId = roomId
    Rooms.set(roomId, room)
    const res = {
        event: 'ROOM_ID',
        roomId
    }
    socket.send(JSON.stringify(res))
}

export const joinRoom = (roomId, socket) => {
    const room = Rooms.get(roomId)
    if (room) {
        if (socket.roomId) {
            leaveRoom(socket)
        }
        room.add(socket)
        socket.roomId = roomId
        const members = getRoomMembers(roomId)
        broadcast(socket, JSON.stringify(members))
    } else {
        socket.send('No Room')
    }
}

export const broadcast = (socket, data) => {
    const room = Rooms.get(socket.roomId)
    room.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        }
    })
}

export const leaveRoom = (socket) => {
    const room = Rooms.get(socket.roomId)
    room.delete(socket)
    const members = getRoomMembers(socket.roomId)
    broadcast(socket, JSON.stringify(members))
    delete socket.roomId
}

export const getRoom = (roomId) => {
    return Rooms.get(roomId)
}

export const getRoomMembers = (roomId) => {
    const room = Rooms.get(roomId)
    if (!room) {
        return null
    }
    const members = []
    for (let client of room) {
        members.push(client.user)
    }
    return members
}