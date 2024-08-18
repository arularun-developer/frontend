import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://backend-6yvu.onrender.com/user/register', formData);
    
      localStorage.setItem('username', formData.username);
      
      toast.success('Registration successful!');
      setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Registration Form</h2>
        <p className="mt-2 text-lg font-semibold leading-8 text-gray-600">
          Register Your Details To Expenses Tracker Application
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
              User Name <span className="text-red-600">*</span>
            </label>
            <div className="mt-2.5">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                placeholder='Enter your username'
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                placeholder='Enter your email ID'
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="password" className="block text-sm font-semibold leading-6 text-gray-900">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="mt-2.5">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder='Enter your Password'
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border text-light">Loading.....</span>
            ) : (
              'Register'
            )}
          </button>
        </div>

        <p className="mt-3 text-center text-lg text-gray-500">
          Already Registered?
          <Link to="/" className="font-semibold text-lg leading-6 text-indigo-600 hover:text-indigo-500 px-1">Login here</Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Register;
