import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [role, setRole] = useState('');
    const [newBlog, setNewBlog] = useState({
        title: '',
        content: '',
        author: 'Dr. Sneha'
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blog');
            setBlogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDeleteBlog = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await axios.delete(`http://localhost:5000/api/blog/${id}`);
                fetchBlogs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const startEditing = (blog) => {
        setEditingId(blog._id);
        setNewBlog({
            title: blog.title,
            content: blog.content,
            author: blog.author
        });
        setImageFile(null);
        setPreviewUrl(blog.image || '');
        window.scrollTo(0, 0);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setNewBlog({ title: '', content: '', author: 'Dr. Sneha' });
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleSubmitBlog = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('content', newBlog.content);
            formData.append('author', newBlog.author);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingId) {
                await axios.put(`http://localhost:5000/api/blog/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('http://localhost:5000/api/blog', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            cancelEditing();
            fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>Doctor's Blogs</h1>

            {/* Doctor can add/edit blog */}
            {role === 'doctor' && (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto 3rem auto', borderTop: '4px solid var(--accent-color)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Blog' : 'Write a New Blog'}</h3>
                    <form onSubmit={handleSubmitBlog} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <input
                            placeholder="Blog Title"
                            value={newBlog.title}
                            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                            required
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />

                        {/* Drag and Drop Image Upload */}
                        <div
                            style={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: '4px',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: previewUrl ? `url(${previewUrl}) center/cover no-repeat` : '#f8fafc',
                                color: previewUrl ? 'transparent' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '150px',
                                position: 'relative'
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('blogFileInput').click()}
                        >
                            {previewUrl ? null : "Drag & Drop Cover Image or Click to Upload"}
                            <input
                                id="blogFileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div style={{ height: '300px', marginBottom: '3rem' }}>
                            <ReactQuill
                                theme="snow"
                                value={newBlog.content}
                                onChange={(value) => setNewBlog({ ...newBlog, content: value })}
                                style={{ height: '100%' }}
                            />
                        </div>

                        <input
                            placeholder="Author Name"
                            value={newBlog.author}
                            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Blog' : 'Publish Blog'}</button>
                            {editingId && (
                                <button type="button" onClick={cancelEditing} className="btn" style={{ background: '#cbd5e1', color: '#334155' }}>Cancel</button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '2rem' }}>
                {blogs.length === 0 ? <p style={{ textAlign: 'center', width: '100%' }}>No blogs posted yet.</p> : (
                    blogs.map(blog => (
                        <div key={blog._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            {blog.image && (
                                <div style={{ height: '300px', overflow: 'hidden' }}>
                                    <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{blog.title}</h2>
                                    {role === 'doctor' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => startEditing(blog)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                title="Edit Blog"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#dc2626' }}
                                                title="Delete Blog"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    By {blog.author} • {new Date(blog.date).toLocaleDateString()}
                                </p>
                                <div
                                    style={{ fontSize: '1.1rem', color: '#334155', lineHeight: '1.8' }}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Blogs;
