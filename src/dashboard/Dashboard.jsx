import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Auth from '../utils/auth'

import Header from '../components/header/Header'

const Dashboard = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    const isAuth = Auth()

    if (!isAuth) {
      navigate('/login')
    }
  }, [])

  return (
    <div className='h-screen'>
      {/* ========  Header =========*/}
      <Header />
      <Outlet />
    </div>
  )
}

export default Dashboard