import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="logo">UserApp</span>
            </div>

            <div className="navbar-right">
                <a href="/">Home</a>
                <a href="/users">Users</a>
                <a href="/register">Register User</a>
            </div>
        </nav>

    );
}
