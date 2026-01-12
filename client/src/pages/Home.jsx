import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [workshops, setWorkshops] = useState([]);
    const [role, setRole] = useState('');
    const [newWorkshop, setNewWorkshop] = useState({ title: '', date: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    // Home Content State
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        schoolBioTitle: '',
        schoolBioContent: '',
        contactEmail: '',
        contactPhone: '',
        contactAddress: ''
    });
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        fetchWorkshops();
        fetchHomeContent();
    }, []);

    const fetchHomeContent = async () => {
        try {
            const res = await axios.get('/api/home-content');
            setContent(res.data);
            setEditForm(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveContent = async () => {
        try {
            await axios.put('/api/home-content', editForm);
            setContent(editForm);
            setIsEditingContent(false);
            alert('Home content updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update home content.');
        }
    };

    const fetchWorkshops = async () => {
        try {
            const res = await axios.get('/api/workshops');
            setWorkshops(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddWorkshop = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/workshops/${editingId}`, newWorkshop);
            } else {
                await axios.post('/api/workshops', newWorkshop);
            }
            cancelEditing();
            fetchWorkshops();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteWorkshop = async (id) => {
        if (window.confirm('Are you sure you want to delete this workshop?')) {
            try {
                await axios.delete(`/api/workshops/${id}`);
                fetchWorkshops();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const startEditing = (shop) => {
        setEditingId(shop._id);
        setNewWorkshop({
            title: shop.title,
            date: shop.date.split('T')[0],
            description: shop.description
        });
        window.scrollTo(0, 0);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewWorkshop({ title: '', date: '', description: '' });
    };

    return (
        <div className="home-page">
            {/* Mentor Controls for Home Content */}
            {role === 'mentor' && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1001 }}>
                    <button
                        onClick={() => setIsEditingContent(!isEditingContent)}
                        className="btn btn-primary"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                    >
                        {isEditingContent ? 'Cancel Edit' : 'Edit Page Content'}
                    </button>
                    {isEditingContent && (
                        <button
                            onClick={handleSaveContent}
                            className="btn btn-accent"
                            style={{ marginLeft: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            )}

            {/* Hero Section */}
            <section className="hero section" style={{ textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'var(--text-light)' }}>
                {isEditingContent ? (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <input
                            value={editForm.heroTitle}
                            onChange={(e) => setEditForm({ ...editForm, heroTitle: e.target.value })}
                            style={{ width: '100%', fontSize: '2rem', padding: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}
                        />
                        <input
                            value={editForm.heroSubtitle}
                            onChange={(e) => setEditForm({ ...editForm, heroSubtitle: e.target.value })}
                            style={{ width: '100%', fontSize: '1.2rem', padding: '0.5rem', textAlign: 'center' }}
                        />
                    </div>
                ) : (
                    <>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{content.heroTitle}</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{content.heroSubtitle}</p>
                    </>
                )}
                <button className="btn btn-accent" style={{ marginTop: '2rem' }}>Explore Workshops</button>
            </section>

            {/* School Bio Section */}
            <section className="section" style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    {isEditingContent ? (
                        <input
                            value={editForm.schoolBioTitle}
                            onChange={(e) => setEditForm({ ...editForm, schoolBioTitle: e.target.value })}
                            style={{ width: '100%', fontSize: '2rem', padding: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)', fontWeight: 'bold' }}
                        />
                    ) : (
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '2rem' }}>{content.schoolBioTitle}</h2>
                    )}

                    <div style={{ lineHeight: '1.8', color: 'var(--text-primary)', fontSize: '1.1rem', textAlign: 'justify' }}>
                        {isEditingContent ? (
                            <textarea
                                value={editForm.schoolBioContent}
                                onChange={(e) => setEditForm({ ...editForm, schoolBioContent: e.target.value })}
                                style={{ width: '100%', minHeight: '300px', padding: '1rem', fontSize: '1.1rem' }}
                            />
                        ) : (
                            content.schoolBioContent?.split('\n\n').map((para, i) => (
                                <p key={i} style={{ marginBottom: '1.2rem' }}>{para}</p>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Workshop Section */}
            <section className="section">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Upcoming Workshops</h2>

                {/* Mentor CMS: Add Workshop */}
                {role === 'mentor' && (
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', border: '1px solid var(--accent-color)' }}>
                        <h3>{editingId ? 'Edit Workshop' : 'Add Workshop'}</h3>
                        <form onSubmit={handleAddWorkshop} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <input placeholder="Title" value={newWorkshop.title} onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })} required style={{ padding: '0.6rem' }} />
                            <input type="date" value={newWorkshop.date} onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })} required style={{ padding: '0.6rem' }} />
                            <textarea placeholder="Description" value={newWorkshop.description} onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })} required style={{ padding: '0.6rem' }}></textarea>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Workshop' : 'Publish Workshop'}</button>
                                {editingId && <button type="button" onClick={cancelEditing} className="btn" style={{ background: '#cbd5e1', color: '#334155' }}>Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {workshops.length === 0 ? <p style={{ textAlign: 'center' }}>No workshops scheduled.</p> : (
                        workshops.map(shop => (
                            <div key={shop._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{shop.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            {new Date(shop.date).toLocaleDateString()}
                                        </span>
                                        {role === 'mentor' && (
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button
                                                    onClick={() => startEditing(shop)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteWorkshop(shop._id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#4a90e2' }}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{shop.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Join Us Preview */}
            <section className="section" style={{ textAlign: 'center' }}>
                <h2>Join Our Mission</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    We are always looking for volunteers, donors, and passionate educators to join the Usha Public School family.
                </p>
                <Link to="/join-us" className="btn btn-primary">Get Involved</Link>
            </section>

            {/* Contact Section */}
            <section className="section" style={{ backgroundColor: '#fdfbf7', borderTop: '1px solid #e2e8f0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Contact Us</h2>
                <div style={{ textAlign: 'center' }}>
                    {isEditingContent ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', margin: '0 auto' }}>
                            <input
                                placeholder="Email"
                                value={editForm.contactEmail}
                                onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                                style={{ padding: '0.5rem' }}
                            />
                            <input
                                placeholder="Phone"
                                value={editForm.contactPhone}
                                onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                                style={{ padding: '0.5rem' }}
                            />
                            <input
                                placeholder="Address"
                                value={editForm.contactAddress}
                                onChange={(e) => setEditForm({ ...editForm, contactAddress: e.target.value })}
                                style={{ padding: '0.5rem' }}
                            />
                        </div>
                    ) : (
                        <>
                            <p>Email: {content.contactEmail}</p>
                            <p>Phone: {content.contactPhone}</p>
                            <p>Address: {content.contactAddress}</p>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
