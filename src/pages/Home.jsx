/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import taskApi from "../api/taskApi";
import userApi from "../api/userApi";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    // States για τα δεδομένα του Dashboard
    const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0 });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Φέρνουμε το σύνολο των χρηστών
                const usersRes = await userApi.getUsers(0, 1);
                // Φέρνουμε τα 5 πιο πρόσφατα tasks παγκοσμίως
                const tasksRes = await taskApi.getTasks(0, 5);

                setStats({
                    totalUsers: usersRes.data.totalElements || 0,
                    totalTasks: tasksRes.data.totalElements || 0
                });
                setRecentTasks(tasksRes.data.content || []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="home">
            <span className="home-badge">Home Page</span>

            <h1 className="home-title">Welcome to the User Management App</h1>
            <p className="home-subtitle">
                Spring Boot backend · React frontend project
            </p>

            <div className="home-actions">
                <button className="primary-btn" onClick={() => navigate("/register")}>
                    Register User
                </button>
                <button className="secondary-btn" onClick={() => navigate("/users")}>
                    View Users
                </button>
            </div>

            <div className="dashboard-section" style={{ marginTop: '50px', width: '100%', maxWidth: '1000px' }}>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div className="card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid #38bdf8' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Registered Users</h3>
                        <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '10px 0', color: '#f1f5f9' }}>{stats.totalUsers}</p>
                    </div>
                    <div className="card" style={{ padding: '20px', textAlign: 'center', borderBottom: '3px solid #10b981' }}>
                        <h3 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Tasks Created</h3>
                        <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: '10px 0', color: '#f1f5f9' }}>{stats.totalTasks}</p>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f1f5f9', fontWeight: '500' }}>Recent Global Activity</h2>
                <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #1e293b' }}>
                    {loading ? (
                        <p style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading live activity...</p>
                    ) : recentTasks.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <tr>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Task</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Creator</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Assignees</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentTasks.map(task => (
                                    <tr key={task.id} className="table-row-hover" style={{ borderTop: '1px solid #1e293b', transition: '0.2s' }}>
                                        <td style={{ padding: '15px', fontWeight: '500', color: '#f1f5f9' }}>{task.title}</td>
                                        <td style={{ padding: '15px', color: '#94a3b8' }}>{task.ownerName}</td>
                                        <td style={{ padding: '15px', color: '#94a3b8' }}>
                                            {task.assigneeNames && task.assigneeNames.length > 0
                                                ? task.assigneeNames.join(", ")
                                                : <span style={{ opacity: 0.4 }}>—</span>}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '4px 10px',
                                                    background: 'rgba(56, 189, 248, 0.1)',
                                                    color: '#38bdf8',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '0.5px'
                                                }}>ACTIVE</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                            <p>No tasks found in the system yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}