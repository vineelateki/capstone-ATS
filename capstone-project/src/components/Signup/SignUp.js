import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // ✅ Import the CSS file

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name,
                email,
                password,
                role: 'employee'
            });
            navigate('/login');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSignUp}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
