import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'https://backend-6yvu.onrender.com/expenses/',
        { amount, category, date, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Expense added successfully!');

      onClose(); // Close the modal
      setTimeout(() => {
        navigate('/Dashboard'); // Reload the dashboard page after 2 seconds
      }, 2000);

    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl"
          >
            &times;
          </button>
          <h2 className="text-lg font-bold">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-6 w-full">
            <label className="block">
              <span className="text-lg font-semibold leading-6 text-gray-900">Amount</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </label>
            <label className="block">
              <span className="text-lg font-semibold leading-6 text-gray-900">Category</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </label>
            <label className="block">
              <span className="text-lg font-semibold leading-6 text-gray-900">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
              />
            </label>
            <label className="block">
              <span className="text-lg font-semibold leading-6 text-gray-900">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                rows="4"
                required
              ></textarea>
            </label>
            <button
              type="submit"
              className="w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isLoading ? (
                <span className="spinner-border text-dark mx-2">Loading...</span>
              ) : (
                'Add Expense'
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

export default Modal;
