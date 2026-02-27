import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="logo">UserApp</span>
            </div>

            <div className="navbar-right">
                <Link to="/">Home</Link>
                <Link to="/users">Users</Link>
                <Link to="/users/new">Register User</Link>
                <Link to="/history">App History</Link>
            </div>
        </nav>
    );
}