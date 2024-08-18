import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.post('https://backend-6yvu.onrender.com/user/login', formData);
      console.log("Response:", response.data);
      
      // Assuming the token is in response.data.token
      const { token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000); 
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold leading-6 text-gray-900">Email address <span className="text-red-600">*</span></label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your user Email ID"
                autoComplete="off"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className='mt-5'>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-lg font-semibold leading-6 text-gray-900">Password <span className="text-red-600">*</span></label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="Enter Your Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? (
                <span className='spinner-border text-dark mx-2'>Loading ...</span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-lg text-gray-500">
          Create New Account Go to &rarr;
          <Link to="/register" className="font-semibold text-lg leading-6 text-indigo-600 hover:text-indigo-500">Register</Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
