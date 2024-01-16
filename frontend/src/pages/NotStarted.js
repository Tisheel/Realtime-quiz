import React, { useContext, useEffect, useState } from 'react'
import { MdPeopleAlt } from 'react-icons/md'
import WebSocketContext from '../context/WebSocketContext'
import { useNavigate } from 'react-router-dom'

const NotStarted = () => {

    const navigate = useNavigate()

    const { user, room, roomSize, currentState } = useContext(WebSocketContext)

    useEffect(() => {
        if (user === null && currentState?.state !== "NOT_STARTED") {
            navigate('/')
            return
        }
    }, [])


    return (
        <div className='font-mono flex flex-col items-center'>
            <div className='text-center p-2 bg-gray-200 text-sm'>
                <span>
                    <span>use code</span>
                    <span className='font-bold'> {room} </span>
                    <span>to join</span>
                </span>
            </div>
            <div className='flex flex-col items-center mt-32 mb-16'>
                <div className='text-center'>
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.profile}`} className='w-44 bg-gray-100 rounded-full animate-bounce' />
                    <div>
                        <span className='font-bold'>{user?.name}</span>
                    </div>
                </div>
                <div>
                    <span className='font-bold text-xs text-gray-500'>waiting for host to start</span>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex items-center font-bold text-2xl gap-2'>
                    <MdPeopleAlt />
                    <span>{roomSize}</span>
                </div>
                <span>Answer fast to get more points!</span>
            </div>
        </div>
    )
}

export default NotStarted