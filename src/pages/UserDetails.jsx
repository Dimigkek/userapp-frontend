import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Προσθήκη Link
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
    const [myTasksPage, setMyTasksPage] = useState(0);
    const [totalMyPages, setTotalMyPages] = useState(0);

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedPage, setAssignedPage] = useState(0);
    const [totalAssignedPages, setTotalAssignedPages] = useState(0);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState(""); // Νέο state για description
    const [assigneeAtCreate, setAssigneeAtCreate] = useState("");

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserForTask, setSelectedUserForTask] = useState({});

    const genderMap = { 'M': 'Male', 'F': 'Female', 'O': 'Other' };

    const loadMyTasks = useCallback(() => {
        taskApi.getTasksByOwner(id, myTasksPage).then(res => {
            setMyTasks(res.data.content || []);
            setTotalMyPages(res.data.totalPages || 0);
        });
    }, [id, myTasksPage]);

    const loadAssignedTasks = useCallback(() => {
        taskApi.getTasksByAssignee(id, assignedPage).then(res => {
            setAssignedTasks(res.data.content || []);
            setTotalAssignedPages(res.data.totalPages || 0);
        });
    }, [id, assignedPage]);

    useEffect(() => {
        userApi.getUserById(id).then(res => {
            setUser(res.data);
            setFormData(res.data);
        });
        userApi.getUsers(0, 100).then(res => setAllUsers(res.data.content || []));
    }, [id]);

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    useEffect(() => {
        loadAssignedTasks();
    }, [loadAssignedTasks]);

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
            const res = await taskApi.createTask({
                title: newTaskTitle,
                description: newTaskDescription,
                ownerId: id
            });
            if (assigneeAtCreate) await taskApi.assignUser(res.data.id, assigneeAtCreate);

            setNewTaskTitle("");
            setNewTaskDescription(""); // Reset description
            setAssigneeAtCreate("");
            setMyTasksPage(0);
            loadMyTasks();
        } catch (err) { console.error(err); }
    };

    const handleAssignUser = async (taskId) => {
        const userIdToAssign = selectedUserForTask[taskId];
        if (!userIdToAssign) return;
        try {
            await taskApi.assignUser(taskId, userIdToAssign);
            loadMyTasks();
            setSelectedUserForTask(prev => ({ ...prev, [taskId]: "" }));
        } catch (err) { console.error(err); }
    };

    const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button className="small-pagination-btn" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>Prev</button>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', minWidth: '80px', textAlign: 'center' }}>
                {currentPage + 1} / {totalPages}
            </span>
            <button className="small-pagination-btn" disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>Next</button>
        </div>
    );

    if (!user) return <div className="page">Loading...</div>;

    return (
        <div className="page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h1 className="page-title" style={{ fontSize: '1.8rem', fontWeight: '600' }}>User Profile</h1>

            <div className="card" style={{ padding: '25px', marginBottom: '25px' }}>
                {!isEditing ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{user.name} {user.surname}</h2>
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                        <div style={{ marginTop: '15px', color: '#94a3b8', fontSize: '1rem' }}>
                            <p style={{ margin: '5px 0' }}><b>Gender:</b> {genderMap[user.gender] || "Not specified"}</p>
                            {user.homeAddress && <p style={{ margin: '5px 0' }}><b>Home Address:</b> {user.homeAddress}</p>}
                            {user.workAddress && <p style={{ margin: '5px 0' }}><b>Work Address:</b> {user.workAddress}</p>}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input className="input" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" />
                            <input className="input" value={formData.surname || ""} onChange={e => setFormData({...formData, surname: e.target.value})} placeholder="Surname" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input className="input" value={formData.homeAddress || ""} onChange={e => setFormData({...formData, homeAddress: e.target.value})} placeholder="Home Address" />
                            <input className="input" value={formData.workAddress || ""} onChange={e => setFormData({...formData, workAddress: e.target.value})} placeholder="Work Address" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>Save Changes</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ flex: 1, backgroundColor: '#334155' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '30px', border: '1px solid #1e293b' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '15px', textTransform: 'uppercase' }}>Quick Create Task</h3>
                <form onSubmit={handleCreateTask}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                        <input className="input" style={{ flex: 3, height: '42px' }} placeholder="What needs to be done?" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
                        <select className="input" style={{ flex: 2, height: '42px' }} value={assigneeAtCreate} onChange={e => setAssigneeAtCreate(e.target.value)}>
                            <option value="">Assign to (Optional)...</option>
                            {allUsers.filter(u => u.id !== parseInt(id)).map(u => (
                                <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        className="input"
                        style={{ width: '100%', minHeight: '60px', marginBottom: '10px', padding: '10px', resize: 'none' }}
                        placeholder="Add a description..."
                        value={newTaskDescription}
                        onChange={e => setNewTaskDescription(e.target.value)}
                    />
                    <button type="submit" className="primary-btn" style={{ width: '100%', height: '42px' }}>Create Task</button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px', fontWeight: 'bold' }}>TASKS I CREATED</h3>
                    {myTasks.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '20px', color: '#475569' }}>No tasks created yet.</div>}
                    {myTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '18px', marginBottom: '15px', borderLeft: '4px solid #334155' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {/* Link για τη σελίδα λεπτομερειών */}
                                <Link to={`/tasks/${task.id}`} className="task-link-title" style={{ fontWeight: '600', color: '#f1f5f9', textDecoration: 'none' }}>
                                    {task.title}
                                </Link>
                                <button onClick={() => taskApi.deleteTask(task.id).then(loadMyTasks)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '10px' }}>
                                👥 Assignees: {task.assigneeNames?.join(", ") || "None"}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                                <select className="input" style={{ flex: 1, height: '36px' }} value={selectedUserForTask[task.id] || ""} onChange={e => setSelectedUserForTask({...selectedUserForTask, [task.id]: e.target.value})}>
                                    <option value="">Add assignee...</option>
                                    {allUsers.filter(u => u.id !== parseInt(id)).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                <button className="primary-btn" style={{ width: '45px', backgroundColor: '#10b981' }} onClick={() => handleAssignUser(task.id)}>+</button>
                            </div>
                        </div>
                    ))}
                    {totalMyPages > 1 && <PaginationControls currentPage={myTasksPage} totalPages={totalMyPages} onPageChange={setMyTasksPage} />}
                </div>

                <div>
                    <h3 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px', fontWeight: 'bold' }}>ASSIGNED TO ME</h3>
                    {assignedTasks.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '20px', color: '#475569' }}>No tasks assigned to you.</div>}
                    {assignedTasks.map(task => (
                        <div key={task.id} className="card" style={{ padding: '18px', marginBottom: '15px', borderLeft: '4px solid #38bdf8', background: 'rgba(56, 189, 248, 0.04)' }}>
                            <Link to={`/tasks/${task.id}`} style={{ fontWeight: '600', color: '#f1f5f9', textDecoration: 'none' }}>
                                {task.title}
                            </Link>
                            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '10px' }}>📩 From: {task.ownerName}</div>
                        </div>
                    ))}
                    {totalAssignedPages > 1 && <PaginationControls currentPage={assignedPage} totalPages={totalAssignedPages} onPageChange={setAssignedPage} />}
                </div>
            </div>

            <button className="back-btn" onClick={() => navigate("/users")} style={{ marginTop: '40px' }}>← Back to Users</button>
        </div>
    );
}