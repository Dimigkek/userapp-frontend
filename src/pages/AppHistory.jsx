import React, { useEffect, useState } from 'react';
import { getAuditLogs, deleteLog } from '../api/auditLogApi';

const AppHistory = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    // Φόρτωση των logs κατά το mount ή όταν αλλάζει η σελίδα
    useEffect(() => {
        loadLogs();
    }, [currentPage]);

    const loadLogs = () => {
        getAuditLogs(currentPage)
            .then(res => setLogs(res.data.content))
            .catch(err => console.error("Error loading logs", err));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Θέλεις σίγουρα να διαγράψεις αυτό το log;")) {
            try {
                await deleteLog(id);
                // Φιλτράρουμε το state για να εξαφανιστεί η γραμμή αμέσως
                setLogs(logs.filter(log => log.id !== id));
            } catch (err) {
                alert("Αποτυχία διαγραφής");
            }
        }
    };

    return (
        <div className="history-container">
            <h2>App History & Audit Logs</h2>
            <table className="audit-table">
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(log => (
                    <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td><span className={`badge ${log.action}`}>{log.action}</span></td>
                        <td>{log.details}</td>
                        <td>
                            <button onClick={() => handleDelete(log.id)} className="btn-delete">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppHistory;