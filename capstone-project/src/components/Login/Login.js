import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                
                // Redirect based on role
                user.role === 'admin' ? navigate('/') : navigate('/profiles');
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Login</button>
            </form>
            
            <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
