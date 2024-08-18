import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaFilter, FaChartPie, FaFileAlt, FaTrash } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa'; // Import download icon
import Modal from '../components/Modal';
import { saveAs } from 'file-saver';

// Function to convert data to CSV format
const convertToCSV = (data) => {
    const header = ["Category", "Amount", "Description", "Date"];
    const rows = data.map(expense => [
        expense.category,
        expense.amount,
        expense.description,
        new Date(expense.date).toLocaleDateString()
    ]);

    return [
        header.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");
};

function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [summary, setSummary] = useState({
        totalMonth: 0,
        categoryTotals: {},
    });

    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const handlePieChartClick = () => navigate('/piechart');
    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const [username, setUsername] = useState('');

    // user details delete
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`https://backend-6yvu.onrender.com/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };
    // summary data
    const handleSummaryClick = () => {
        const summaryText = `
            Total Expenses for the Month: ₹${summary.totalMonth.toFixed(2)}
            \nTotal per Category: \n${Object.entries(summary.categoryTotals).map(([category, total]) =>
            `${category}: ₹${total.toFixed(2)}`).join('\n')}
        `;
        alert(summaryText);
    };

    // user data list
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://backend-6yvu.onrender.com/expenses/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExpenses(response.data);

                const totalMonth = response.data.reduce((sum, expense) => sum + expense.amount, 0);
                const categoryTotals = response.data.reduce((totals, expense) => {
                    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
                    return totals;
                }, {});
                setSummary({ totalMonth, categoryTotals });

            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [expenses]);
    // sorting of data

    useEffect(() => {
        if (selectedCategory) {
            setFilteredExpenses(expenses.filter(expense => expense.category === selectedCategory));
        } else {
            setFilteredExpenses(expenses);
        }
    }, [selectedCategory, expenses]);

    // download csv file
    const handleExportCSV = () => {
        const csvData = convertToCSV(expenses);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'expenses.csv');
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    return (
        <div className="min-h-full">
            <nav className="bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className='text-white font-bold text-lg'>Expenses Tracker App</h1>
                            </div>
                            <div className="hidden md:block">
                                <div className="space-y-1 px-3 sm:px-3">
                                    <Link to="/Dashboard" className="block rounded-md px-3 py-2 text-lg font-semibold text-gray-300 hover:bg-gray-700 hover:text-white">Dashboard</Link>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <div className="relative ml-3">
                                    <button
                                        type="button"
                                        className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none"
                                        onClick={toggleMenu}
                                    >
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt="User"
                                        />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                                            <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700">Sign out</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className={`block h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className={`block h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                    <div className="space-y-1 px-4 py-3">
                        <Link
                            to="/Dashboard"
                            className="block w-full rounded-md px-3 py-2 text-lg font-semibold text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            Dashboard
                        </Link>
                    </div>
                    <div className="border-t border-gray-700 py-3">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-white">Tom Cook</div>
                                <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
                            </div>
                        </div>
                        <div className="mt-3 px-4">
                            <a
                                href="#"
                                onClick={handleSignOut}
                                className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                Sign out
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <div className="bg-white py-2 sm:py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0 ">
                            <h2 className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
                                Welcome to Expense Tracker Dashboard
                            </h2>
                        </div>
                        <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            <div className="flex items-center justify-end space-x-4 col-span-full">
                                <button
                                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                                    onClick={handleExportCSV}
                                >
                                    <FaDownload className="h-3 w-6" />
                                </button>
                                <button
                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                    onClick={openModal}
                                >
                                    <FaPlus className="h-3 w-6" />
                                </button>
                                <button
                                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                                    onClick={handleSummaryClick}
                                >
                                    <FaFileAlt className="h-3 w-6" />
                                </button>
                                <button
                                    className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                                    onClick={handlePieChartClick}
                                >
                                    <FaChartPie className="h-3 w-6" />
                                </button>

                                <div className="relative">
                                    <button
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                        onClick={toggleDropdown}
                                    >
                                        <FaFilter className="h-3 w-6 text-gray-600" />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                            <a
                                                href="#"
                                                onClick={() => setSelectedCategory('Food')}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Food
                                            </a>
                                            <a
                                                href="#"
                                                onClick={() => setSelectedCategory('Transport')}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Transport
                                            </a>
                                            <a
                                                href="#"
                                                onClick={() => setSelectedCategory('Entertainment')}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                Entertainment
                                            </a>
                                            <a
                                                href="#"
                                                onClick={() => setSelectedCategory(null)}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            >
                                                All
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {filteredExpenses.map((expense) => (
                                <article
                                    key={expense._id}
                                    className="flex flex-col max-w-xl border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-center justify-between p-4 border-gray-200">
                                        <div className="flex items-center gap-x-4">

                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-600">
                                                <a href="#">
                                                    ₹{expense.amount}
                                                </a>
                                            </h3>
                                        </div>
                                        <a
                                            href="#"
                                            className={`rounded-full px-3 py-1.5 font-medium text-white ${expense.category === 'Food'
                                                ? 'bg-red-500'
                                                : expense.category === 'Transport'
                                                    ? 'bg-blue-500'
                                                    : expense.category === 'Entertainment'
                                                        ? 'bg-green-500'
                                                        : 'bg-black'
                                                } hover:opacity-90`}
                                        >
                                            {expense.category}
                                        </a>
                                        <button
                                            className="p-1 text-gray-400 hover:text-red-600"
                                            onClick={() => handleDelete(expense._id)}
                                        >
                                            <FaTrash className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                            {expense.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-start p-4 text-sm text-gray-500">
                                        <img
                                            src={expense.userImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} // Fallback image
                                            alt="User"
                                            className="h-10 w-10 rounded-full bg-gray-50"
                                        />
                                        <div>
                                        <span className='ml-4'>{new Date(expense.date).toLocaleDateString()}</span>
                                        {username && <h1 className='ml-4'>{username}</h1>}
                                        </div>
                                       
                                    </div>
                                   

                                </article>
                            ))}

                        </div>
                    </div>
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default Dashboard;
