import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../ScrumDetails/ScrumDetails'; // ✅ Corrected import path
import { UserContext } from '../../context/UserContext'; // ✅ Corrected import path
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // ✅ Ensured the correct CSS import

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();

        try {
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: newScrumName,
            });

            const newScrum = newScrumResponse.data;

            await axios.post('http://localhost:4000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);

            setShowForm(false);
            setNewScrumName('');
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('To Do');
            setNewTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Scrum Teams</h2>
                {user?.role === 'admin' && (
                    <button className="add-scrum-button" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                )}
            </div>

            {showForm && (
                <form className="scrum-form" onSubmit={handleAddScrum}>
                    <label>Scrum Name:</label>
                    <input type="text" value={newScrumName} onChange={(e) => setNewScrumName(e.target.value)} required />

                    <label>Task Title:</label>
                    <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />

                    <label>Task Description:</label>
                    <input type="text" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} required />

                    <label>Task Status:</label>
                    <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} required>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <label>Assign To:</label>
                    <select value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} required>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>

                    <button type="submit">Create Scrum</button>
                </form>
            )}

            <ul className="scrum-list">
                {scrums.map((scrum) => (
                    <li className="scrum-item" key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>

            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
