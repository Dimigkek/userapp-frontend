import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import taskApi from "../api/taskApi";

export default function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = () => {
        taskApi.getTaskById(taskId)
            .then(res => setTask(res.data))
            .catch(err => console.error("Error loading task", err));
    };

    const handleStatusUpdate = (newStatus) => {
        taskApi.updateTaskStatus(taskId, newStatus)
            .then(() => loadTask())
            .catch(err => console.error("Update failed", err));
    };

    if (!task) return <div className="page">Loading...</div>;

    return (
        <div className="page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button className="secondary-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="card" style={{ marginTop: '20px', padding: '30px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: '#f1f5f9' }}>{task.title}</h1>
                    <span style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
                        {task.status}
                    </span>
                </div>

                <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
                    <p style={{ margin: 0, color: '#94a3b8' }}>
                        <strong style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Owner:</strong>
                        <span style={{ marginLeft: '10px', color: '#f1f5f9' }}>{task.ownerName}</span>
                    </p>
                    <p style={{ margin: 0, color: '#94a3b8' }}>
                        <strong style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Assignees:</strong>
                        <span style={{ marginLeft: '10px', color: '#f1f5f9' }}>
                            {task.assigneeNames?.length > 0 ? task.assigneeNames.join(", ") : "None"}
                        </span>
                    </p>
                    <div style={{ marginTop: '10px' }}>
                        <strong style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Description:</strong>
                        <p style={{
                            marginTop: '10px',
                            padding: '15px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px',
                            color: '#cbd5e1',
                            lineHeight: '1.6',
                            fontSize: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {task.description || "No description provided."}
                        </p>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #1e293b', margin: '30px 0' }} />

                <h3 style={{ fontSize: '0.9rem', color: '#f1f5f9', marginBottom: '20px' }}>Update Status</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={task.status === 'OPEN' ? 'primary-btn' : 'secondary-btn'}
                        style={{ flex: 1, height: '45px' }}
                        onClick={() => handleStatusUpdate('OPEN')}
                    >
                        Open
                    </button>
                    <button
                        className={task.status === 'ONGOING' ? 'primary-btn' : 'secondary-btn'}
                        style={{ flex: 1, height: '45px' }}
                        onClick={() => handleStatusUpdate('ONGOING')}
                    >
                        Ongoing
                    </button>
                    <button
                        className={task.status === 'COMPLETED' ? 'primary-btn' : 'secondary-btn'}
                        style={{ flex: 1, height: '45px' }}
                        onClick={() => handleStatusUpdate('COMPLETED')}
                    >
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
}