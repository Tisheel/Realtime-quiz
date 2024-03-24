import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import WebSocketContext from '../../context/WebSocketContext'
import Header from './Header'
import { GET_TESTS } from '../../utils/constants'

const Dashboard = () => {

    const [loading, setLoading] = useState(false)
    const [tests, setTests] = useState(null)

    const navigate = useNavigate()
    const { streamTest } = useContext(WebSocketContext)

    const fetchTests = async () => {

        setLoading(true)

        try {

            const { data } = await axios.get(GET_TESTS)

            setTests(data)

            setLoading(false)

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)
            setLoading(false)

        }
    }

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/login')
            return
        }

        fetchTests()

    }, [])

    return (
        <div>
            <Header />
            {
                loading ? <span>loading...</span>
                    :
                    tests && <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium">title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium">Questions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            {
                                tests.map(test => (
                                    <tr key={test._id}>
                                        <td className="px-6 py-3">{test.title}</td>
                                        <td className="px-6 py-3">{test.questions.length}</td>
                                        <td className="px-6 py-3">
                                            <button className='p-1 bg-blue-900 text-white rounded-md'
                                                onClick={() => streamTest(test._id)}>Start Streaming</button>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
            }
        </div>
    )
}

export default Dashboard