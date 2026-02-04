import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6 shadow">
            <span className="font-semibold text-lg">UserApp</span>

            <Link to="/" className="hover:text-gray-300">
                Home
            </Link>

            <Link to="/users" className="hover:text-gray-300">
                Users
            </Link>

            <Link
                to="/users/new"
                className="ml-auto bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
                Register User
            </Link>
        </nav>
    );
}
