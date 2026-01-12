import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentDetail from '../components/StudentDetail'; // New component

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // For Detail View
    const [role, setRole] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [newParentEmail, setNewParentEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!storedRole) {
            navigate('/login');
            return;
        }
        setRole(storedRole);
        if (storedRole === 'mentor') {
            fetchStudents(user.id);
        } else if (storedRole === 'parent') {
            if (user.linkedStudentId) {
                fetchMyChild(user.linkedStudentId);
            } else {
                console.error("No student linked to this parent account.");
            }
        }
    }, [navigate]);

    const fetchMyChild = async (studentId) => {
        try {
            const res = await axios.get(`/api/dashboard/student/my-child/${studentId}`);
            setSelectedStudent(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async (mentorId) => {
        try {
            const res = await axios.get(`/api/dashboard/my-students/${mentorId}`);
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post('/api/dashboard/students', {
                name: newStudentName,
                mentor: user.id
            });

            if (res.data.generatedUsername) {
                alert(`STUDENT FILE CREATED!\n\nParent Access Credentials:\nUsername: ${res.data.generatedUsername}\nPassword: ${res.data.generatedPassword}\n\nPlease share these with the parent.`);
            }

            setNewStudentName('');
            fetchStudents(user.id);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.response?.data?.msg || err.message;
            alert(`Error creating student file: ${errorMsg}`);
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student profile? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/dashboard/students/${studentId}`);
                const user = JSON.parse(localStorage.getItem('user'));
                fetchStudents(user.id);
            } catch (err) {
                console.error(err);
                alert('Failed to delete student');
            }
        }
    };

    const [parentSearchName, setParentSearchName] = useState('');
    const [searchError, setSearchError] = useState('');

    const handleParentSearch = async (e) => {
        e.preventDefault();
        setSearchError('');
        try {
            const res = await axios.post('/api/dashboard/student/search', { name: parentSearchName });
            setSelectedStudent(res.data);
            setParentSearchName('');
        } catch (err) {
            setSearchError('Student not found. Please check the name.');
            setSelectedStudent(null);
        }
    };

    return (
        <div className="section">
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

            {selectedStudent ? (
                <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
            ) : (
                <>
                    {/* Mentor: Add Student */}
                    {role === 'mentor' && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3>Add New Student File</h3>
                            <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Student Name (Generates Username)"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    required
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button type="submit" className="btn btn-primary">Create File</button>
                            </form>
                        </div>
                    )}

                    {/* Parent: Automatic View */}
                    {role === 'parent' && (
                        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Find Your Child</h3>
                            <p>We are searching for a student profile linked to your email...</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>
                                If your child's file does not open automatically, please contact your mentor to ensure they have added your email address (<b>{JSON.parse(localStorage.getItem('user'))?.email}</b>) to the student record.
                            </p>
                            <button onClick={() => window.location.reload()} className="btn btn-accent" style={{ marginTop: '1rem' }}>Retry</button>
                        </div>
                    )}

                    {/* Mentor: Student List */}
                    {role === 'mentor' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
                            {students.length === 0 ? <p>No students found. Add one to get started.</p> : (
                                students.map(student => (
                                    <div key={student._id} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}>
                                        <div onClick={() => setSelectedStudent(student)}>
                                            <h3 style={{ color: 'var(--primary-color)' }}>{student.name}</h3>
                                            <p style={{ color: '#64748b' }}>Click to view tasks & progress</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening detail view
                                                handleDeleteStudent(student._id);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: '#4a90e2',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '0.2rem 0.5rem',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
