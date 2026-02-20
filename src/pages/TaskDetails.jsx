/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import taskApi from "../api/taskApi";
import userApi from "../api/userApi";
import "./Home.css";

export default function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [editData, setEditData] = useState({
        title: "",
        description: "",
        ownerId: null,
        assigneeIds: []
    });

    useEffect(() => {
        loadTask();
        userApi.getUsers(0, 100).then(res => {
            setAllUsers(res.data.content || res.data);
        });
    }, [taskId]);

    const loadTask = () => {
        taskApi.getTaskById(taskId).then(res => {
            setTask(res.data);
            // ΣΗΜΑΝΤΙΚΟ: Μετατροπή των assigneeIds σε Numbers για να δουλεύει το .includes() σωστά
            const initialIds = res.data.assigneeIds ? res.data.assigneeIds.map(id => Number(id)) : [];
            setEditData({
                title: res.data.title,
                description: res.data.description || "",
                ownerId: res.data.ownerId,
                assigneeIds: initialIds
            });
        });
    };

    const query = searchTerm.toLowerCase().trim();

    const displayUsers = allUsers
        .filter(user => {
            const userId = Number(user.id);
            if (editData.assigneeIds.includes(userId)) return true;
            if (!query) return true;
            return user.name.toLowerCase().startsWith(query) ||
                user.surname.toLowerCase().startsWith(query);
        })
        .sort((a, b) => {
            // Ταξινόμηση: Οι επιλεγμένοι πηγαίνουν στην αρχή της λίστας
            const aSelected = editData.assigneeIds.includes(Number(a.id));
            const bSelected = editData.assigneeIds.includes(Number(b.id));
            return bSelected - aSelected;
        });

    const handleStatusUpdate = (newStatus) => {
        taskApi.updateTaskStatus(taskId, newStatus).then(() => loadTask());
    };

    const handleSave = () => {
        taskApi.updateTask(taskId, editData).then(() => {
            setIsEditing(false);
            loadTask();
        });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            taskApi.deleteTask(taskId).then(() => navigate("/"));
        }
    };

    if (!task) return <div className="page">Loading...</div>;

    return (
        <div className="page">
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="secondary-btn" onClick={() => navigate(-1)}>← Back</button>
                    {!isEditing ? (
                        <button className="primary-btn glow" onClick={() => setIsEditing(true)}>Edit Task</button>
                    ) : (
                        <>
                            <button className="primary-btn" onClick={handleSave} style={{ backgroundColor: '#10b981' }}>Save Changes</button>
                            <button className="secondary-btn" onClick={() => { setIsEditing(false); setSearchTerm(""); loadTask(); }}>Cancel</button>
                        </>
                    )}
                </div>
                {isEditing && (
                    <button className="primary-btn" onClick={handleDelete} style={{ backgroundColor: '#ef4444' }}>
                        Delete Task
                    </button>
                )}
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isEditing ? (
                        <input
                            className="input"
                            style={{ width: '70%', fontSize: '1.5rem', fontWeight: 'bold' }}
                            value={editData.title}
                            onChange={e => setEditData({...editData, title: e.target.value})}
                        />
                    ) : (
                        <h1 style={{ margin: 0 }}>{task.title}</h1>
                    )}
                    <span className="status-label" style={{ color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {task.status}
                    </span>
                </div>

                <div className="task-info" style={{ marginTop: '20px' }}>
                    <p style={{ color: '#94a3b8' }}><strong>OWNER:</strong> <span style={{ color: 'white', marginLeft: '10px' }}>{task.ownerName}</span></p>
                    <p style={{ color: '#94a3b8' }}><strong>ASSIGNEES:</strong> <span style={{ color: 'white', marginLeft: '10px' }}>{task.assigneeNames?.join(", ") || "None"}</span></p>

                    <div style={{ marginTop: '20px' }}>
                        <strong style={{ color: '#94a3b8' }}>DESCRIPTION:</strong>
                        {isEditing ? (
                            <textarea
                                className="input"
                                style={{ minHeight: '120px', marginTop: '10px', width: '100%', lineHeight: '1.5' }}
                                value={editData.description}
                                onChange={e => setEditData({...editData, description: e.target.value})}
                            />
                        ) : (
                            <div className="description-box" style={{
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                padding: '20px',
                                borderRadius: '10px',
                                marginTop: '10px',
                                border: '1px solid #1e293b',
                                color: '#cbd5e1'
                            }}>
                                {task.description || "No description provided."}
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        border: '1px solid #1e293b'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <strong style={{ color: '#94a3b8' }}>Modify Assignees</strong>
                            <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{editData.assigneeIds.length} selected</span>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="🔍 Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 15px',
                                    background: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            padding: '5px'
                        }}>
                            {displayUsers.map(user => {
                                const userId = Number(user.id);
                                const isChecked = editData.assigneeIds.includes(userId);

                                return (
                                    <label key={user.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '10px',
                                        background: isChecked ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                        borderRadius: '8px',
                                        border: `1px solid ${isChecked ? '#3b82f6' : 'transparent'}`,
                                        transition: '0.2s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }}
                                            onChange={() => {
                                                const newIds = isChecked
                                                    ? editData.assigneeIds.filter(id => id !== userId)
                                                    : [...editData.assigneeIds, userId];
                                                setEditData({...editData, assigneeIds: newIds});
                                            }}
                                        />
                                        <span style={{ color: isChecked ? 'white' : '#94a3b8', fontSize: '0.9rem' }}>
                                            {user.name} {user.surname}
                                        </span>
                                    </label>
                                );
                            })}
                            {displayUsers.length === 0 && (
                                <p style={{ gridColumn: '1/3', textAlign: 'center', color: '#475569', padding: '10px' }}>No users found.</p>
                            )}
                        </div>
                    </div>
                )}

                <hr style={{ margin: '30px 0', border: '0.5px solid #1e293b' }} />

                <div className="status-update-section">
                    <h3 style={{ color: '#94a3b8', marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Update Status</h3>
                    <div className="status-buttons" style={{ display: 'flex', gap: '12px' }}>
                        {['OPEN', 'ONGOING', 'COMPLETED'].map((s) => (
                            <button
                                key={s}
                                className={`status-btn ${task.status === s ? 'active' : ''}`}
                                onClick={() => handleStatusUpdate(s)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: task.status === s ? '#3b82f6' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${task.status === s ? '#3b82f6' : '#1e293b'}`,
                                    color: 'white',
                                    boxShadow: task.status === s ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}