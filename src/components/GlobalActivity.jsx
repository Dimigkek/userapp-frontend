/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import taskApi from "../api/taskApi";

export default function GlobalActivity() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await taskApi.getAllTasks(currentPage, pageSize);
                setTasks(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } catch (err) {
                console.error("Failed to fetch activity", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [currentPage]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
            case 'ONGOING': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
            default: return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' };
        }
    };

    return (
        <div className="card" style={{
            padding: '0',
            overflow: 'hidden',
            border: '1px solid #1e293b',
            position: 'relative',
            minHeight: '400px'
        }}>

            {loading && tasks.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    backdropFilter: 'blur(2px)'
                }}>
                    <div className="loader"></div>
                </div>
            )}

            {loading && tasks.length === 0 ? (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <div className="loader" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '20px', color: '#94a3b8' }}>Fetching tasks...</p>
                </div>
            ) : tasks.length > 0 ? (
                <>
                    <div style={{ overflowX: 'auto', opacity: loading ? 0.5 : 1, transition: '0.3s' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b' }}>Task</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b' }}>Creator</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b' }}>Assignees</th>
                                <th style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map(task => {
                                const statusStyle = getStatusStyle(task.status);
                                return (
                                    <tr
                                        key={task.id}
                                        className="table-row-hover"
                                        onClick={() => navigate(`/tasks/${task.id}`)}
                                        style={{ borderTop: '1px solid #1e293b', cursor: 'pointer' }}
                                    >
                                        <td style={{ padding: '15px', fontWeight: '500', color: '#f1f5f9' }}>{task.title}</td>
                                        <td style={{ padding: '15px', color: '#94a3b8' }}>{task.ownerName}</td>
                                        <td style={{ padding: '15px', color: '#94a3b8' }}>
                                            {task.assigneeNames?.length > 0 ? task.assigneeNames.join(", ") : "—"}
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '4px 10px',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold'
                                                }}>{task.status || 'OPEN'}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        gap: '20px',
                        borderTop: '1px solid #1e293b',
                        minHeight: '70px'
                    }}>

                        {currentPage > 0 ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev - 1); }}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    minWidth: '120px',
                                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                &larr; Previous
                            </button>
                        ) : (
                            <div style={{ minWidth: '120px' }}></div>
                        )}

                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
        Page <strong>{currentPage + 1}</strong> of {totalPages}
    </span>

                        {currentPage + 1 < totalPages ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev + 1); }}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    minWidth: '120px',
                                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Next &rarr;
                            </button>
                        ) : (
                            <div style={{ minWidth: '120px' }}></div>
                        )}
                    </div>
                </>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                    <p>No tasks found.</p>
                </div>
            )}
        </div>
    );
}