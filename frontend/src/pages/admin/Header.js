import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const navigate = useNavigate()

    const logout = () => {
        sessionStorage.removeItem("token")
        navigate('/login')
    }

    return (
        <div className='flex justify-between bg-blue-900 text-white p-5 font-mono shadow-md'>
            <span className='text-xl'>Dashboard</span>
            <div>
                <button onClick={logout}>logout</button>
            </div>
        </div>
    )
}

export default Header