import React, { useContext, useEffect, useState } from 'react'
import WebSocketContext from '../context/WebSocketContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Question = () => {

    const navigate = useNavigate()

    const [double, setDouble] = useState(false)

    const { user, room, currentState, submitAnswer, next } = useContext(WebSocketContext)
    const question = currentState?.question

    useEffect(() => {
        if (user === null && currentState?.state !== "QUESTION") {
            navigate('/')
            return
        }
    }, [])

    const handleSubmit = () => {
        const answerIndex = document.querySelector('input[name="option"]:checked').value
        if (!answerIndex) {
            return toast('No option is selected')
        }
        submitAnswer(currentState?.id, answerIndex)
        setDouble(true)
    }

    return (
        <>
            <div className='font-mono'>
                <div className='text-center p-2 bg-gray-200 text-sm'>
                    <span>
                        <span>use code</span>
                        <span className='font-bold'> {room} </span>
                        <span>to join</span>
                    </span>
                </div>
                <div className='my-6 mx-2'>
                    {/* <div>
                        <span>Question <span className='font-bold'>2</span> of <span className='font-bold'>5</span></span>
                    </div> */}
                    <div className='my-6'>
                        <p className='font-bold'>
                            {question?.question}
                        </p>
                    </div>
                    <div className='my-6'>
                        {
                            question?.options.map((option, index) => {
                                return <div className='flex my-6' key={index}>
                                    <input className='mx-2' type='radio' name='option' value={index} />
                                    <p>{option?.option}</p>
                                </div>
                            })
                        }
                    </div>
                    <div>
                        {
                            !sessionStorage.getItem('token') &&
                                !double ? <button disabled={double} className='bg-black text-white font-bold text-sm p-2 rounded-xl px-6' onClick={() => handleSubmit()}>Done</button>
                                : <div>
                                    <span className='font-bold text-xs text-gray-500'>waiting for host to continue...</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
            {
                sessionStorage.getItem('token') && <button className='bg-blue-900 relative bottom-0 w-full text-white font-semibold py-4' onClick={() => next()}>NEXT</button>
            }
        </>
    )
}

export default Question