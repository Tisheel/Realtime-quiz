import React from 'react'
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

const Result = () => {
    return (
        <div className='font-mono'>
            <div className='text-center p-2 bg-gray-200 text-sm'>
                <span>
                    <span>use code</span>
                    <span className='font-bold'> 1234-5678 </span>
                    <span>to join</span>
                </span>
            </div>
            <div className='my-12 mx-2'>
                <div>
                    <span>Question <span className='font-bold'>2</span> of <span className='font-bold'>5</span></span>
                </div>
                <div className='mt-6 mb-12'>
                    <p className='font-bold'>
                        Admin should be allowed to add questions
                        Admin should be allowed to move to the next questions
                        Admin should be allowed to show the leaderboard to everyone
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
                                data: [25, 20, 50, 5],
                                backgroundColor: [
                                    'rgba(255, 0, 0, 0.6)',
                                    'rgba(255, 0, 0, 0.6)',
                                    'rgba(65, 255, 0, 0.6)',
                                    'rgba(255, 0, 0, 0.6)'
                                ]
                            }]
                        }}
                    />
                </div>
            </div>
            <div className='text-center'>
                <span className='font-bold text-xs text-gray-500 animate-pulse'>waiting for host to continue...</span>
            </div>
        </div>
    )
}

export default Result