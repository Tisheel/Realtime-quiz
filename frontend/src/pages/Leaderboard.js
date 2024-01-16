import React, { useContext, useEffect } from 'react'
import WebSocketContext from '../context/WebSocketContext'
import { useNavigate } from 'react-router-dom'

const Leaderboard = () => {

    const navigate = useNavigate()

    const { user, room, currentState } = useContext(WebSocketContext)

    useEffect(() => {
        if (user === null && currentState?.state !== "LEADERBOARD") {
            navigate('/')
            return
        }
    }, [])

    return (
        <div className='font-mono'>
            <div className='text-center p-2 bg-gray-200 text-sm'>
                <span>
                    <span>use code</span>
                    <span className='font-bold'> {room} </span>
                    <span>to join</span>
                </span>
            </div>
            <div className='my-6 mx-2'>
                <div>
                    <span className='font-bold text-2xl'>Leaderboard</span>
                </div>
                <div>
                    {
                        currentState?.leaderboard.map((member, index) => {
                            return <div className='flex items-center justify-between px-10 my-2' key={index}>
                                <span>#{index + 1}</span>
                                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.profile}`} className='w-14 bg-gray-100 rounded-full' />
                                <span>{member.name}</span>
                                <span>{member.score}p</span>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className='text-center'>
                <span className='font-bold text-xs text-gray-500 animate-pulse'>waiting for host to continue...</span>
            </div>
        </div>
    )
}

export default Leaderboard