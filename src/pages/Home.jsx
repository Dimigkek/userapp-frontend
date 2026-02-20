import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import taskApi from "../api/taskApi";
import userApi from "../api/userApi";
import GlobalActivity from "../components/GlobalActivity";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [uRes, tRes] = await Promise.all([
                    userApi.getUsers(0, 1),
                    taskApi.getAllTasks(0, 1)
                ]);
                setStats({
                    totalUsers: uRes.data.totalElements || 0,
                    totalTasks: tRes.data.totalElements || 0
                });
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, []);

    return (
        <div className="home">
            <h1 className="home-title">Welcome to the User Management App</h1>

            <div className="home-actions">
                <button className="primary-btn" onClick={() => navigate("/users/new")}>Register User</button>
                <button className="secondary-btn" onClick={() => navigate("/users")}>View Users</button>
            </div>

            <div className="dashboard-section" style={{ marginTop: '50px', width: '100%', maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div className="card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid #38bdf8' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Users</h3>
                        <p style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid #10b981' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Tasks</h3>
                        <p style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.totalTasks}</p>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f1f5f9' }}>Recent Global Activity</h2>

                <GlobalActivity />

            </div>
        </div>
    );
}