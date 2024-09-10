import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getAllGroups } from '../redux/groupReduser';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Auth from '../utils/auth';

import Snackbar from '../components/snackbar/Snackbar';

const Login = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })

    const handleCloseSnackBar = () => {
        setSnackBar({ open: false, message: '', type: '' })
    }

    const handleSubmitData = async (input) => {
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });
            const data = await response.json();
            if (!data.token) {
                setSnackBar({ open: true, message: data?.message, type: 'error' })
                return
            }
            localStorage.setItem("token", data?.token)
              dispatch(getAllGroups())
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const isAuth = Auth()
        if (isAuth) {
            navigate('/dashboard')
        }
    }, [navigate])

    return (
        <div className='flex justify-center items-center h-screen bg-gray-200'>
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg items-center">
                <div className="flex justify-center mx-auto">
                    <p className='font-semibold font-sans text-2xl'>Login</p>
                </div>
                <form className="mt-6" onSubmit={handleSubmit(handleSubmitData)}>
                    <div>
                        <label
                            htmlFor="username"
                            className="text-sm text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name='email'
                            {...register('email', { required: 'Email is required' })}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                        />
                        {
                            errors?.email?.message && (
                                <span className='text-red-500'>
                                    {errors?.email?.message}
                                </span>
                            )
                        }
                    </div>
                    <div className="mt-4">
                        <label
                            htmlFor="password"
                            className="text-sm text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name='passowrd'
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                        />
                        {
                            errors?.password?.message && (
                                <span className='text-red-500'>
                                    {errors?.password?.message}
                                </span>
                            )
                        }
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-6 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <Snackbar open={snackbar.open} message={snackbar.message} type={snackbar.type} onclose={handleCloseSnackBar} />
        </div>
    )
}

export default Login

