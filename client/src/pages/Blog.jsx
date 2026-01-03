import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/blog');
                setBlogs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Doctor's Insights</h1>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
                {blogs.length === 0 ? <p>No posts yet.</p> : (
                    blogs.map(blog => (
                        <div key={blog._id} className="card">
                            <h2 style={{ marginBottom: '0.5rem' }}>{blog.title}</h2>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                                By {blog.author} on {new Date(blog.date).toLocaleDateString()}
                            </p>
                            <p style={{ lineHeight: '1.7' }}>{blog.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Blog;
