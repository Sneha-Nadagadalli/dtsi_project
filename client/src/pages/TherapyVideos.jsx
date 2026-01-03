import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TherapyVideos = () => {
    const [videos, setVideos] = useState([]);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({ title: '', url: '', category: 'General' });

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/videos');
            setVideos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/videos', formData);
            setFormData({ title: '', url: '', category: 'General' });
            fetchVideos();
        } catch (err) {
            console.error(err);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0];
        } else if (url.includes('embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Therapy Resources</h1>

            {/* Mentor CMS: Add Video */}
            {role === 'mentor' && (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', border: '1px solid var(--accent-color)' }}>
                    <h3>Add New Video</h3>
                    <form onSubmit={handleAddVideo} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <input
                            placeholder="Video Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            style={{ padding: '0.6rem' }}
                        />
                        <input
                            placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            required
                            style={{ padding: '0.6rem' }}
                        />
                        <input
                            placeholder="Category (e.g. Speech, Motor)"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ padding: '0.6rem' }}
                        />
                        <button type="submit" className="btn btn-primary">Add Resource</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {videos.length === 0 ? <p>No videos available.</p> : (
                    videos.map(video => (
                        <div key={video._id} className="card">
                            <div style={{ aspectRatio: '16/9', backgroundColor: '#000', marginBottom: '1rem' }}>
                                <iframe
                                    src={getYouTubeEmbedUrl(video.url)}
                                    title={video.title}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <h3>{video.title}</h3>
                            <p>{video.category}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TherapyVideos;
