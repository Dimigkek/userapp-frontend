import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white px-6 py-4 flex gap-6">
            <Link to="/" className="hover:text-gray-300">
                Home
            </Link>
            <Link to="/users" className="hover:text-gray-300">
                Display Users
            </Link>
            <Link to="/users/new" className="hover:text-gray-300">
                Register User
            </Link>
        </nav>
    );
}
