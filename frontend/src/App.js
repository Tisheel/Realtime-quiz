import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Room from './pages/Room'
import Test from './pages/Test'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Room />} />
      <Route path='/:roomId' element={<Test />} />
    </Routes>
  )
}

export default App