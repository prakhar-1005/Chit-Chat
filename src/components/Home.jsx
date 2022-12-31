import React from 'react'
import Chat from '../home-components/Chat'
import Sidebar from '../home-components/Sidebar'

const Home = () => {
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home
