import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);
function Piechart() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://backend-6yvu.onrender.com/expenses/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const labels = data.map(item => item.category);
                const amounts = data.map(item => item.amount);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Expenses by Category',
                        data: amounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    }],
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);

        };


        fetchExpenses();
    }, []);

  return (
    <div>
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
      <div className="py-2 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-4 rounded-lg shadow-md">
            {loading ? (
              <p>Loading...</p> 
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
                <Pie data={chartData} className='w-36' />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
    </div>
  )
}

export default Piechart
