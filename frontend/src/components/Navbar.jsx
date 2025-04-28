import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex-shrink-0 text-xl font-bold">
                            Task Tracker
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {currentUser && (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="hover:underline">
                                    {currentUser.name}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;