import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import WebSocketContext from '../context/WebSocketContext'

const Room = () => {

    const [room, setRoom] = useState(null)
    const [name, setName] = useState(null)

    const { joinRoom } = useContext(WebSocketContext)

    const handleJoinRoom = (e) => {
        e.preventDefault()
        // validation to be done
        joinRoom(room, name)
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='flex flex-col items-center'>
                <div className='text-center font-mono mb-5'>
                    <div>
                        <span className='font-bold text-xl'>Enter the code to join</span>
                    </div>
                    <div>
                        <span className='font-extralight text-sm text-gray-600'>it's on the screen in front of you</span>
                    </div>
                </div>
                <form className='font-mono w-full mb-5'>
                    <div>
                        <input className='border-2 p-2 rounded-lg w-full' type='text' placeholder='1234-5678' onChange={(e) => setRoom(e.target.value)} />
                    </div>
                    <div className='mt-4 mb-4'>
                        <label className='font-bold text-xs'>Enter your name</label>
                        <div>
                            <input className='border-2 p-2 rounded-lg w-full' type='text' onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button className='bg-black text-white font-bold text-sm p-2 rounded-xl cursor-pointer'
                            onClick={(e) => handleJoinRoom(e)}>
                            Join Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Room