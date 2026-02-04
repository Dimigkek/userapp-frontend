import { useEffect, useState } from "react";
import { getUsers } from "../api/userApi";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers()
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to load users");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <table className="w-full border border-gray-700">
                <thead className="bg-gray-800">
                <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Surname</th>
                    <th className="p-2 border">Gender</th>
                    <th className="p-2 border">Birthdate</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-900">
                        <td className="p-2 border">{u.name}</td>
                        <td className="p-2 border">{u.surname}</td>
                        <td className="p-2 border">{u.gender}</td>
                        <td className="p-2 border">{u.birthdate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
