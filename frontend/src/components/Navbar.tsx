import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    setShowToast: (showToast: boolean) => void;
}
// const Navbar: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
function Navbar({ setShowToast }: NavbarProps): JSX.Element {
    const { isLoggedIn } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout: logoutContext } = useAuth();

    const navigate = useNavigate();
    // const [showToast, setShowToast] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logoutContext();
        navigate('/login');  
        // Show success toast message
        setShowToast(true);
        // Remove toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000); 
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">Habit Tracker</h1>
                {/* Menu items */}
                <div className="hidden md:flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="text-white hover:text-gray-300">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-300">
                                Login
                            </Link>
                            <Link to="/signup" className="text-white hover:text-gray-300">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
                {/* Hamburger menu */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-gray-700 p-4">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="block text-white hover:text-gray-300">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="block text-white hover:text-gray-300">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-white hover:text-gray-300">
                                Login
                            </Link>
                            <Link to="/signup" className="block text-white hover:text-gray-300">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
