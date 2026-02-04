import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1 className="home-title">Welcome to the User Management App</h1>
            <p className="home-subtitle">
                Spring Boot backend – React frontend
            </p>

            <div className="home-actions">
                <button
                    className="primary-btn"
                    onClick={() => navigate("/users/new")}
                >
                    Register User
                </button>

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/users")}
                >
                    View Users
                </button>
            </div>
        </div>
    );
}
