import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../api/auditLogApi.js'

const AppHistory = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getAuditLogs().then(response => {
            setLogs(response.data.content);
        });
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">App History & Logs</h2>
            <table className="min-w-full bg-white border">
                <thead>
                <tr>
                    <th className="border p-2">Timestamp</th>
                    <th className="border p-2">Action</th>
                    <th className="border p-2">Details</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(log => (
                    <tr key={log.id}>
                        <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="border p-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {log.action}
                                </span>
                        </td>
                        <td className="border p-2">{log.details}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppHistory;