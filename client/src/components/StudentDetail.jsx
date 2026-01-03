import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StudentDetail = ({ student, onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [chartData, setChartData] = useState([]);
    const [role, setRole] = useState(localStorage.getItem('role'));

    // Edit Name State
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(student.name);

    // Filter & Sort State
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const getProcessedTasks = () => {
        let processed = [...tasks];

        // Filter
        if (filterStatus !== 'All') {
            processed = processed.filter(t => t.status === filterStatus);
        }

        // Sort
        processed.sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate) : new Date(a.assignedDate);
            const dateB = b.dueDate ? new Date(b.dueDate) : new Date(b.assignedDate);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return processed;
    };

    useEffect(() => {
        fetchTasks();
    }, [student]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/dashboard/tasks/${student._id}`);
            setTasks(res.data);
            calculateChartData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const calculateChartData = (taskList) => {
        // Bucket grades into categories for the Pie Chart
        let excellent = 0; // 8-10
        let good = 0;      // 5-7
        let needsFocus = 0; // 1-4
        let notGraded = 0; // 0

        taskList.forEach(t => {
            const s = t.score || 0;
            if (s >= 8) excellent++;
            else if (s >= 5) good++;
            else if (s >= 1) needsFocus++;
            else notGraded++;
        });

        const data = [
            { name: 'Excellent (8-10)', value: excellent, color: '#4a90e2' }, // Blue
            { name: 'Good (5-7)', value: good, color: '#2e3a46' },      // Charcoal
            { name: 'Needs Focus (1-4)', value: needsFocus, color: '#e67e22' }, // Orange
            { name: 'Not Graded', value: notGraded, color: '#bdc3c7' }   // Silver
        ].filter(d => d.value > 0); // Only show segments with data

        setChartData(data);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const dateInput = document.getElementById('taskDueDate');
            await axios.post('http://localhost:5000/api/dashboard/tasks', {
                title: newTask,
                student: student._id,
                dueDate: dateInput ? dateInput.value : null
            });
            if (dateInput) dateInput.value = '';
            setNewTask('');
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const updateTask = async (task, updates) => {
        try {
            await axios.put(`http://localhost:5000/api/dashboard/tasks/${task._id}`, updates);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateName = async () => {
        try {
            await axios.put(`http://localhost:5000/api/dashboard/students/${student._id}`, { name: editedName });
            student.name = editedName; // Optimistic update
            setIsEditingName(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update name');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <button onClick={onBack} className="btn" style={{ background: '#4a90e2', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>&larr;</span> Back to Dashboard
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isEditingName ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                style={{ padding: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button onClick={handleUpdateName} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
                            <button onClick={() => setIsEditingName(false)} className="btn" style={{ padding: '0.5rem 1rem', background: '#ccc' }}>Cancel</button>
                        </div>
                    ) : (
                        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Student File: <span style={{ color: 'var(--accent-color)' }}>{student.name}</span>
                            {role === 'mentor' && (
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    title="Edit Name"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
                                >
                                    ✏️
                                </button>
                            )}
                        </h2>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                {/* Left: Task Management (Wider) */}
                <div className="card" style={{ minHeight: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Tasks & Performance</h3>

                        {/* Filter & Sort Controls */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">Doing</option>
                                <option value="Completed">Done</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                {sortOrder === 'asc' ? 'Date ⬆' : 'Date ⬇'}
                            </button>
                        </div>
                    </div>

                    {/* Mentor: Add Task Form */}
                    {role === 'mentor' && (
                        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                            <input
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Enter new task description..."
                                required
                                style={{ flex: 1, padding: '1rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                            />
                            <input
                                type="date"
                                id="taskDueDate"
                                style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', fontSize: '1rem' }}>Add Task</button>
                        </form>
                    )}

                    {/* Mentor: Access Info */}
                    {role === 'mentor' && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--primary-color)', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>Parent Access Info</h4>
                            <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>Username: <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{student.accessUsername || 'Not Generated'}</span></p>
                            <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>Password: <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>112233</span> (Fixed)</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', opacity: 0.8, marginTop: '0.5rem' }}>Share these credentials with the parent for access.</p>
                        </div>
                    )}

                    {/* MEDICAL CONDITION SECTION */}
                    <div className="card" style={{ marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem', color: '#dc2626' }}>Medical Condition</h3>
                        {role === 'mentor' ? (
                            <textarea
                                placeholder="Describe student's condition, diagnosis, or special needs..."
                                defaultValue={student.conditionDescription || ''}
                                onBlur={async (e) => {
                                    try {
                                        await axios.put(`http://localhost:5000/api/dashboard/students/${student._id}`, { conditionDescription: e.target.value });
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                style={{ width: '100%', minHeight: '100px', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
                            ></textarea>
                        ) : (
                            <p style={{ lineHeight: '1.6', color: '#334155' }}>{student.conditionDescription || 'No detailed condition information provided.'}</p>
                        )}

                        <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Medical Records</h4>
                        {/* List Records */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {student.medicalRecords && student.medicalRecords.length > 0 ? (
                                student.medicalRecords.map(record => (
                                    <div key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '0.8rem', borderRadius: '6px' }}>
                                        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: '500' }}>
                                            📄 {record.filename}
                                        </a>
                                        {role === 'mentor' && (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Delete this record?')) {
                                                        try {
                                                            await axios.delete(`http://localhost:5000/api/dashboard/students/${student._id}/medical-records/${record._id}`);
                                                            // Ideally trigger a re-fetch here, but for now user might need to refresh or we add parent callback
                                                            window.location.reload();
                                                        } catch (err) { console.error(err); }
                                                    }
                                                }}
                                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No records uploaded.</p>
                            )}
                        </div>

                        {/* Upload Form */}
                        {role === 'mentor' && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <input
                                    type="file"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        try {
                                            await axios.post(`http://localhost:5000/api/dashboard/students/${student._id}/medical-records`, formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            });
                                            window.location.reload(); // Refresh to show new file
                                        } catch (err) { console.error(err); }
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Mentor: Add Task Form */}
                    {role === 'mentor' && (
                        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                            <input
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="New task..."
                                required
                                style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                            <input
                                type="date"
                                id="taskDueDate"
                                style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Add</button>
                        </form>
                    )}

                    {/* Notion-style Task Table */}
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '0.8rem 1rem', fontWeight: '600' }}>Task Name</th>
                                    <th style={{ padding: '0.8rem 1rem', fontWeight: '600', width: '120px' }}>Due Date</th>
                                    <th style={{ padding: '0.8rem 1rem', fontWeight: '600', width: '130px' }}>Status</th>
                                    <th style={{ padding: '0.8rem 1rem', fontWeight: '600', width: '100px' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProcessedTasks().length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No tasks found.</td>
                                    </tr>
                                ) : (
                                    getProcessedTasks().map(task => (
                                        <tr key={task._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.8rem 1rem', color: '#334155', fontWeight: '500' }}>
                                                {task.title}
                                            </td>
                                            <td style={{ padding: '0.8rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td style={{ padding: '0.8rem 1rem' }}>
                                                {role === 'mentor' ? (
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => updateTask(task, { status: e.target.value })}
                                                        style={{
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            background: task.status === 'Completed' ? '#dcfce7' : task.status === 'In Progress' ? '#fef3c7' : '#f1f5f9',
                                                            color: task.status === 'Completed' ? '#166534' : task.status === 'In Progress' ? '#b45309' : '#64748b',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">Doing</option>
                                                        <option value="Completed">Done</option>
                                                    </select>
                                                ) : (
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.85rem',
                                                        background: task.status === 'Completed' ? '#dcfce7' : task.status === 'In Progress' ? '#fef3c7' : '#f1f5f9',
                                                        color: task.status === 'Completed' ? '#166534' : task.status === 'In Progress' ? '#b45309' : '#64748b',
                                                        fontWeight: '600'
                                                    }}>
                                                        {task.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.8rem 1rem' }}>
                                                {role === 'mentor' ? (
                                                    <input
                                                        type="number"
                                                        min="0" max="10"
                                                        defaultValue={task.score}
                                                        onBlur={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            if (!isNaN(val) && val >= 0 && val <= 10) {
                                                                updateTask(task, { score: val });
                                                            }
                                                        }}
                                                        style={{ width: '50px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>{task.score || '-'}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Progress Visualization (Sidebar) */}
                <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Analytics</h3>
                    {tasks.length > 0 ? (
                        <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <PieChart margin={{ top: 20, bottom: 20 }}>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ value }) => `${value}`}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                            <p>Add graded tasks to visualize performance data.</p>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px' }}>
                        <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#475569' }}>Scoring Guide:</p>
                        <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4a90e2' }}></span>
                                <span><strong>8-10:</strong> Excellent</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2e3a46' }}></span>
                                <span><strong>5-7:</strong> Good</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e67e22' }}></span>
                                <span><strong>1-4:</strong> Needs Focus</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;
