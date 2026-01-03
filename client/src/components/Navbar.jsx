import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Usha Public School</Link>
            </div>
            <div className="nav-links">
                <NavLink to="/" end>Home</NavLink>
                {user && <NavLink to="/dashboard">Dashboard</NavLink>}
                <NavLink to="/videos">Resources</NavLink>
                <NavLink to="/blogs">Doctor's Blog</NavLink>
                <NavLink to="/shop">Our Products</NavLink>

                {user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: 'var(--accent-color)' }}>
                            Hi, {user.name}
                        </span>
                        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid white', color: 'white' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <NavLink to="/login" className="btn btn-accent">Login</NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
