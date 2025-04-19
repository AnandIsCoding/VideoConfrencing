import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import VideoCallPage from './pages/VideoCallPage'

function App() {
  return (
    <Routes>
       <Route path='/' element={ <LandingPage/>} />
       <Route path='/:room' element={ <VideoCallPage/>} />
    </Routes>
  )
}

export default App
