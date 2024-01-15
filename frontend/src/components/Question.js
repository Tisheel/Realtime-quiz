import React from 'react'

const Question = () => {
    return (
        <div className='font-mono'>
            <div className='text-center p-2 bg-gray-200 text-sm'>
                <span>
                    <span>use code</span>
                    <span className='font-bold'> 1234-5678 </span>
                    <span>to join</span>
                </span>
            </div>
            <div className='my-6 mx-2'>
                <div>
                    <span>Question <span className='font-bold'>2</span> of <span className='font-bold'>5</span></span>
                </div>
                <div className='my-6'>
                    <p className='font-bold'>
                        Admin should be allowed to add questions
                        Admin should be allowed to move to the next questions
                        Admin should be allowed to show the leaderboard to everyone
                    </p>
                </div>
                <div className='my-6'>
                    <div className='flex my-6'>
                        <input className='mx-2' type='radio' name='option' />
                        <p>Option 1</p>
                    </div>
                    <div className='flex my-6'>
                        <input className='mx-2' type='radio' name='option' />
                        <p>Option 1</p>
                    </div>
                    <div className='flex my-6'>
                        <input className='mx-2' type='radio' name='option' />
                        <p>Option 1</p>
                    </div>
                    <div className='flex my-6'>
                        <input className='mx-2' type='radio' name='option' />
                        <p>Option 1</p>
                    </div>
                </div>
                <div>
                    <button className='bg-black text-white font-bold text-sm p-2 rounded-xl px-6'>Done</button>
                </div>
            </div>
        </div>
    )
}

export default Question