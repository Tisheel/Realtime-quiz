import React, { useContext, useEffect } from 'react'
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import WebSocketContext from '../context/WebSocketContext'
import { useNavigate } from 'react-router-dom'

const Result = () => {

    const navigate = useNavigate()

    const { user, room, currentState, next } = useContext(WebSocketContext)
    const question = currentState?.question

    useEffect(() => {
        if (user === null && currentState?.state !== "RESULT") {
            navigate('/')
            return
        }
    }, [])

    const backgroundColor = [
        'rgba(255, 0, 0, 0.6)',
        'rgba(255, 0, 0, 0.6)',
        'rgba(255, 0, 0, 0.6)',
        'rgba(255, 0, 0, 0.6)'
    ]

    backgroundColor[currentState?.answer] = 'rgba(65, 255, 0, 0.6)'

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
                <div className='my-12 mx-2'>
                    <div>
                        <span>Question <span className='font-bold'>2</span> of <span className='font-bold'>5</span></span>
                    </div>
                    <div className='mt-6 mb-12'>
                        <p className='font-bold'>
                            {question?.question}
                        </p>
                    </div>
                    <div>
                        <Bar
                            options={{
                                scales: {
                                    y: {
                                        display: false,
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                            data={{
                                labels: ['1', '2', '3', '4'],
                                datasets: [{
                                    data: question?.options,
                                    backgroundColor
                                }]
                            }}
                        />
                    </div>
                </div>
                <div className='text-center'>
                    <span className='font-bold text-xs text-gray-500 animate-pulse'>waiting for host to continue...</span>
                </div>
            </div>
            {
                sessionStorage.getItem('token') && <button className='bg-blue-900 absolute bottom-0 w-full text-white font-semibold py-4' onClick={() => next()}>NEXT</button>
            }
        </>
    )
}

export default Result