import React from 'react'
import { MdPeopleAlt } from 'react-icons/md'

const NotStarted = () => {
    return (
        <div className='font-mono flex flex-col items-center'>
            <div className='text-center p-2 bg-gray-200 text-sm'>
                <span>
                    <span>use code</span>
                    <span className='font-bold'> 1234-5678 </span>
                    <span>to join</span>
                </span>
            </div>
            <div className='flex flex-col items-center mt-32 mb-16'>
                <div className='text-center'>
                    <img src='https://api.dicebear.com/7.x/bottts/svg?seed=456' className='w-44 bg-gray-100 rounded-full animate-bounce' />
                    <div>
                        <span className='font-bold'>Jhon Doe</span>
                    </div>
                </div>
                <div>
                    <span className='font-bold text-xs text-gray-500'>waiting for host to start</span>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex items-center font-bold text-2xl gap-2'>
                    <MdPeopleAlt />
                    <span>86</span>
                </div>
                <span>Answer fast to get more points!</span>
            </div>
        </div>
    )
}

export default NotStarted