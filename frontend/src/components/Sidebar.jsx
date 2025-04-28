import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <nav className="space-y-2">
                <Link
                    to="/dashboard"
                    className={`block p-2 rounded ${isActive('/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-700'
                        }`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/profile"
                    className={`block p-2 rounded ${isActive('/profile') ? 'bg-blue-600' : 'hover:bg-gray-700'
                        }`}
                >
                    Profile
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;