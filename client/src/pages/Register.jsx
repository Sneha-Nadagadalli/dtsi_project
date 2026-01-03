import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'parent' // Default to parent
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration Failed');
        }
    };

    const customStyle = {
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem'
    };

    return (
        <div className="card" style={customStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="user">Select Role</option>
                    <option value="mentor">Mentor</option>
                    <option value="doctor">Doctor</option>
                </select>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link>
            </p>
        </div>
    );
};

export default Register;
