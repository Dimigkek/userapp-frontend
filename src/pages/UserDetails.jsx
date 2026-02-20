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
        }).catch(err => alert("Update failed"));
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
        } catch (err) { console.error(err); }
    };

    if (!user) return <div className="page">Loading...</div>;

    return (
        <div className="page" style={{ maxWidth: '950px', margin: '0 auto', padding: '20px' }}>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>User Profile</h1>

            {/* PROFILE SECTION */}
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                {!isEditing ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0 }}>{user.name} {user.surname}</h2>
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                        <div style={{ marginTop: '15px', color: '#ccc', fontSize: '0.95rem' }}>
                            <p><b>Gender:</b> {genderMap[user.gender]} | <b>Address:</b> {user.homeAddress || "N/A"}</p>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input className="input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
                            <input className="input" value={formData.surname || ""} onChange={e => setFormData({...formData, surname: e.target.value})} placeholder="Surname" />
                        </div>
                        <input className="input" value={formData.homeAddress || ""} onChange={e => setFormData({...formData, homeAddress: e.target.value})} placeholder="Home Address" />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>Save Changes</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ flex: 1, backgroundColor: '#444' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            {/* QUICK CREATE */}
            <div className="card" style={{ padding: '15px', marginBottom: '25px', border: '1px solid #333' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#00d4ff', marginBottom: '12px', textTransform: 'uppercase' }}>Quick Create Task</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px' }}>
                    <input className="input" style={{ flex: 3 }} placeholder="What needs to be done?" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
                    <select className="input" style={{ flex: 2 }} value={assigneeAtCreate} onChange={e => setAssigneeAtCreate(e.target.value)}>
                        <option value="">Assign to (Optional)...</option>
                        {allUsers.filter(u => u.id !== parseInt(id)).map(u => (
                            <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                        ))}
                    </select>
                    <button type="submit" className="primary-btn" style={{ flex: 1 }}>Create</button>
                </form>
            </div>

            {/* TASK COLUMNS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                {/* COLUMN 1: MY TASKS */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>MY TASKS</h3>
                    {myTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '15px', marginBottom: '12px', borderLeft: '4px solid #444' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '500' }}>{task.title}</span>
                                <button onClick={() => taskApi.deleteTask(task.id).then(loadTasks)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#00d4ff', margin: '8px 0' }}>
                                👥 {task.assigneeNames?.join(", ") || "No one assigned"}
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <select className="input" style={{ height: '30px', fontSize: '0.75rem' }} onChange={e => setSelectedUserForTask({...selectedUserForTask, [task.id]: e.target.value})}>
                                    <option value="">Add Assignee...</option>
                                    {allUsers.filter(u => u.id !== parseInt(id)).map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <button className="primary-btn" style={{ width: '40px', height: '30px', padding: 0, backgroundColor: '#28a745' }} onClick={() => handleAssignUser(task.id)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* COLUMN 2: ASSIGNED TO ME */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#888', marginBottom: '15px' }}>ASSIGNED TO ME</h3>
                    {assignedTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '15px', marginBottom: '12px', borderLeft: '4px solid #00d4ff', background: 'rgba(0, 212, 255, 0.03)' }}>
                            <div style={{ fontWeight: '500', marginBottom: '10px' }}>{task.title}</div>
                            <span style={{ fontSize: '0.75rem', color: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                                📩 From: {task.ownerName}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/users")} style={{ marginTop: '30px' }}>← Back to Users</button>
        </div>
    );
}