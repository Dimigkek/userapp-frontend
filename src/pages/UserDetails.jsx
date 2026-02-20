import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import taskApi from "../api/taskApi";
import "./CreateUser.css";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const [myTasks, setMyTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [assigneeAtCreate, setAssigneeAtCreate] = useState("");

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserForTask, setSelectedUserForTask] = useState({});

    const genderMap = { 'M': 'Male', 'F': 'Female', 'O': 'Other' };

    useEffect(() => {
        userApi.getUserById(id).then(res => {
            setUser(res.data);
            setFormData(res.data);
        });
        // eslint-disable-next-line react-hooks/immutability
        loadTasks();
        userApi.getUsers(0, 100).then(res => setAllUsers(res.data.content || []));
    }, [id]);

    const loadTasks = () => {
        taskApi.getTasksByOwner(id).then(res => setMyTasks(res.data));
        taskApi.getTasksByAssignee(id).then(res => setAssignedTasks(res.data));
    };

    const handleUpdate = () => {
        userApi.updateUser(id, formData).then(res => {
            setUser(res.data);
            setIsEditing(false);
        }).catch(() => alert("Update failed"));
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            const res = await taskApi.createTask({ title: newTaskTitle, ownerId: id });
            if (assigneeAtCreate) await taskApi.assignUser(res.data.id, assigneeAtCreate);
            setNewTaskTitle(""); setAssigneeAtCreate(""); loadTasks();
        } catch (err) { console.error(err); }
    };

    const handleAssignUser = async (taskId) => {
        const userIdToAssign = selectedUserForTask[taskId];
        if (!userIdToAssign) return;
        try {
            await taskApi.assignUser(taskId, userIdToAssign);
            loadTasks();
            setSelectedUserForTask(prev => ({ ...prev, [taskId]: "" }));
        } catch (err) { console.error(err); }
    };

    if (!user) return <div className="page">Loading...</div>;

    return (
        <div className="page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h1 className="page-title" style={{ fontSize: '1.8rem', fontWeight: '600' }}>User Profile</h1>

            {/* PROFILE SECTION */}
            <div className="card" style={{ padding: '25px', marginBottom: '25px' }}>
                {!isEditing ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{user.name} {user.surname}</h2>
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                        <div style={{ marginTop: '15px', color: '#94a3b8', fontSize: '1rem' }}>
                            <p><b>Gender:</b> {genderMap[user.gender]} | <b>Address:</b> {user.homeAddress || "Not specified"}</p>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input className="input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
                            <input className="input" value={formData.surname || ""} onChange={e => setFormData({...formData, surname: e.target.value})} placeholder="Surname" />
                        </div>
                        <input className="input" value={formData.homeAddress || ""} onChange={e => setFormData({...formData, homeAddress: e.target.value})} placeholder="Home Address" />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>Save Changes</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ flex: 1, backgroundColor: '#334155' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '30px', border: '1px solid #1e293b' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Create Task</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input className="input" style={{ flex: 3, height: '42px' }} placeholder="What needs to be done?" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
                    <select className="input" style={{ flex: 2, height: '42px' }} value={assigneeAtCreate} onChange={e => setAssigneeAtCreate(e.target.value)}>
                        <option value="">Assign to (Optional)...</option>
                        {allUsers.filter(u => u.id !== parseInt(id)).map(u => (
                            <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                        ))}
                    </select>
                    <button type="submit" className="primary-btn" style={{ flex: 1, height: '42px', minWidth: '100px' }}>Create</button>
                </form>
            </div>

            {/* TASK COLUMNS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/* COLUMN: MY TASKS */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px', fontWeight: 'bold' }}>TASKS I CREATED</h3>
                    {myTasks.length === 0 && <p style={{color: '#475569', fontSize: '0.9rem'}}>No tasks created yet.</p>}
                    {myTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '18px', marginBottom: '15px', borderLeft: '4px solid #334155', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontWeight: '600', fontSize: '1.05rem', color: '#f1f5f9' }}>{task.title}</span>
                                <button onClick={() => taskApi.deleteTask(task.id).then(loadTasks)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#38bdf8', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{opacity: 0.7}}>👥 Assignees:</span>
                                <span>{task.assigneeNames?.join(", ") || "None"}</span>
                            </div>

                            {/* Διορθωμένο Assign Section */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px', width: '100%' }}>
                                <select
                                    className="input"
                                    style={{ flex: 1, height: '36px', fontSize: '0.85rem', padding: '0 10px' }}
                                    value={selectedUserForTask[task.id] || ""}
                                    onChange={e => setSelectedUserForTask({...selectedUserForTask, [task.id]: e.target.value})}
                                >
                                    <option value="">Add assignee...</option>
                                    {allUsers.filter(u => u.id !== parseInt(id)).map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="primary-btn"
                                    style={{ width: '45px', height: '36px', padding: 0, backgroundColor: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    onClick={() => handleAssignUser(task.id)}
                                >
                                    <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>+</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* COLUMN: ASSIGNED TO ME */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px', fontWeight: 'bold' }}>ASSIGNED TO ME</h3>
                    {assignedTasks.length === 0 && <p style={{color: '#475569', fontSize: '0.9rem'}}>No tasks assigned to you.</p>}
                    {assignedTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '18px', marginBottom: '15px', borderLeft: '4px solid #38bdf8', background: 'rgba(56, 189, 248, 0.04)' }}>
                            <div style={{ fontWeight: '600', fontSize: '1.05rem', color: '#f1f5f9', marginBottom: '12px' }}>{task.title}</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                <span>📩 From:</span>
                                <span style={{fontWeight: 'bold'}}>{task.ownerName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/users")} style={{ marginTop: '40px', padding: '10px 20px' }}>← Back to Users</button>
        </div>
    );
}