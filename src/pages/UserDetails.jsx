import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import taskApi from "../api/taskApi"; // Το νέο API για τα tasks
import "./CreateUser.css";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // States για τον User
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // States για τα Tasks
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const genderMap = {
        'M': 'Male',
        'F': 'Female',
        'O': 'Other'
    };

    useEffect(() => {
        // 1. Φόρτωση στοιχείων χρήστη
        userApi.getUserById(id)
            .then(res => {
                setUser(res.data);
                setFormData(res.data);
            })
            .catch(err => console.error("Error fetching user:", err));

        // 2. Φόρτωση tasks του χρήστη
        loadTasks();
    }, [id]);

    const loadTasks = () => {
        taskApi.getTasksByOwner(id)
            .then(res => setTasks(res.data))
            .catch(err => console.error("Error fetching tasks:", err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        userApi.updateUser(id, formData)
            .then(res => {
                setUser(res.data);
                setIsEditing(false);
            })
            .catch(err => {
                console.error("Update error:", err);
                alert("Failed to update user.");
            });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            // Στέλνουμε το title και το ownerId (το id από το useParams)
            await taskApi.createTask({
                title: newTaskTitle,
                description: "", // Μπορείς να προσθέσεις input και για αυτό
                ownerId: id
            });
            setNewTaskTitle(""); // Καθαρισμός input
            loadTasks(); // Refresh τη λίστα των tasks
        } catch (err) {
            console.error("Task creation error:", err);
            alert("Failed to create task.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskApi.deleteTask(taskId);
            loadTasks(); // Refresh μετά τη διαγραφή
        } catch (err) {
            console.error("Delete task error:", err);
            alert("Failed to delete task.");
        }
    };

    if (!user) return <p className="page">Loading...</p>;

    return (
        <div className="page">
            <h1 className="page-title">User Profile</h1>

            {/* --- SECTION: USER INFO --- */}
            <div className="card">
                {!isEditing ? (
                    <>
                        <h2 className="card-title">{user.name} {user.surname}</h2>
                        <div className="card-section">
                            <p><b>Gender:</b> {genderMap[user.gender] || user.gender}</p>
                            <p><b>Birthdate:</b> {user.birthdate}</p>
                            <p><b>Home Address:</b> {user.homeAddress || "—"}</p>
                            <p><b>Work Address:</b> {user.workAddress || "—"}</p>
                        </div>
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
                ) : (
                    <div className="form-card">
                        <h2 className="card-title" style={{ color: 'white', marginBottom: '20px' }}>Edit User Profile</h2>
                        <label className="label">
                            Name *
                            <input className="input" name="name" value={formData.name || ""} onChange={handleChange} required />
                        </label>
                        <label className="label">
                            Surname *
                            <input className="input" name="surname" value={formData.surname || ""} onChange={handleChange} required />
                        </label>
                        <label className="label">
                            Gender *
                            <select className="input" name="gender" value={formData.gender || ""} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </label>
                        <label className="label">
                            Birthdate *
                            <input type="date" className="input date-input" name="birthdate" value={formData.birthdate || ""} onChange={handleChange} required />
                        </label>
                        <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="primary-btn" onClick={handleUpdate} style={{ flex: 1 }}>Save Changes</button>
                            <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h2 className="card-title">User Tasks</h2>

                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        className="input"
                        placeholder="Enter task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button type="submit" className="primary-btn" style={{ width: '120px' }}>Add Task</button>
                </form>

                {tasks.length === 0 ? (
                    <p style={{ color: '#aaa', textAlign: 'center' }}>No tasks found for this user.</p>
                ) : (
                    <ul className="user-list">
                        {tasks.map(task => (
                            <li key={task.id} className="user-item">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="user-link" style={{ cursor: 'default', textDecoration: 'none' }}>
                                        {task.title}
                                    </span>
                                    <small style={{ color: '#888', fontSize: '0.8rem' }}>
                                        Assignees: {task.assigneeNames && task.assigneeNames.length > 0
                                        ? task.assigneeNames.join(", ")
                                        : "None"}
                                    </small>
                                </div>
                                <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button className="back-btn" onClick={() => navigate("/users")}>
                ← Back to Users
            </button>
        </div>
    );
}