import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const login = async (e) => {

        e.preventDefault()
        setLoading(true)

        try {

            const { data } = await axios.post('/v1/login', { email, password })

            sessionStorage.setItem('token', data?.token)
            navigate('/dashboard')

            setLoading(false)

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)
            setLoading(false)

        }

    }

    useEffect(() => {
        if (sessionStorage.getItem('token'))
            navigate('/dashboard')
    }, [])

    return (
        <div className='flex items-center justify-center h-screen'>
            <form className='font-mono flex flex-col border-2 p-5 rounded-xl shadow-xl' onSubmit={login}>
                <div>
                    <span className='font-bold text-2xl'>Login</span>
                    <div className='my-4'>
                        <label className='font-bold text-xs'>Email</label>
                        <input className='border-2 p-2 rounded-lg w-full' type='email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='my-4'>
                        <label className='font-bold text-xs'>Password</label>
                        <input className='border-2 p-2 rounded-lg w-full' type='password' onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <button className='bg-black text-white font-bold text-sm p-2 rounded-xl cursor-pointer'>
                    {
                        loading ? 'Loading...' : 'Login'
                    }
                </button>
            </form>
        </div>
    )
}

export default Login