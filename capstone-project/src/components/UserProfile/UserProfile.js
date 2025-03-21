import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import './UserProfile.css'; // ✅ Import CSS file

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(u => u?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        if (user) fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleGetHistory = (userId) => {
        const foundUser = users.find(u => u?.id === userId);
        if (foundUser) {
            setSelectedUser(foundUser);
            fetchTasks(userId);
        }
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });
            const updatedUsers = await axios.get('http://localhost:4000/users');
            setUsers(updatedUsers.data.filter(u => u?.role !== 'admin'));
            setShowForm(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('employee');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:4000/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteHistory = async (taskId, historyIndex) => {
        try {
            const task = tasks.find(task => task.id === taskId);
            if (!task) return;

            const updatedHistory = [...task.history];
            updatedHistory.splice(historyIndex, 1);
            
            await axios.patch(`http://localhost:4000/tasks/${taskId}`, { history: updatedHistory });

            setTasks(prevTasks =>
                prevTasks.map(t => (t.id === taskId ? { ...t, history: updatedHistory } : t))
            );
        } catch (error) {
            console.error('Error deleting history entry:', error);
        }
    };

    return (
        <div className="user-profile-container">
            <h2>User Profiles</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New User'}
                    </button>
                    {showForm && (
                        <form onSubmit={handleAddUser}>
                            <div>
                                <label>Name:</label>
                                <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                            </div>
                            <div>
                                <label>Role:</label>
                                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit">Create User</button>
                        </form>
                    )}
                    <ul className="user-list">
                        {users.map(userItem => (
                            <li key={userItem?.id} className="user-item">
                                <strong>Name:</strong> {userItem?.name} <br />
                                <strong>Email:</strong> {userItem?.email} <br />
                                <button className="history-button" onClick={() => handleGetHistory(userItem?.id)}>
                                    Get History
                                </button>
                                {user?.role === 'admin' && (
                                    <button className="delete-button" onClick={() => handleDeleteUser(userItem?.id)}>
                                        🗑️ Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (
                <div>
                    <h3>Tasks Worked By {selectedUser?.name}</h3>
                    <ul className="task-list">
                        {tasks.map(task => (
                            <li key={task.id} className="task-item">
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> 
                                <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                                    {task.status}
                                </span>
                                <h5>History:</h5>
                                <ul className="task-history">
                                    {task.history.map((entry, index) => (
                                        <li key={index}>
                                            {entry.status} - {entry.date} 
                                            {user?.role === 'admin' && (
                                                <button className="delete-history-button" onClick={() => handleDeleteHistory(task.id, index)}>
                                                    🗑️
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
