import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Room from './pages/Room'
import { Toaster } from 'react-hot-toast'
import NotStarted from './pages/NotStarted'
import Question from './pages/Question'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Room />} />
        <Route path='/not_started' element={<NotStarted />} />
        <Route path='/question' element={<Question />} />
        <Route path='/result' element={<Result />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      <Toaster position='bottom-center' />
    </>
  )
}

export default App