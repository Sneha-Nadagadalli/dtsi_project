import React from 'react';

const Gallery = () => {
    // Placeholder data
    const items = [
        { id: 1, type: 'Photo', title: 'School Event', src: 'https://via.placeholder.com/300' },
        { id: 2, type: 'Photo', title: 'Art Class', src: 'https://via.placeholder.com/300' },
        { id: 3, type: 'Video', title: 'Annual Day', src: 'https://via.placeholder.com/300' },
        { id: 4, type: 'Photo', title: 'Field Trip', src: 'https://via.placeholder.com/300' },
        { id: 5, type: 'Photo', title: 'Music Session', src: 'https://via.placeholder.com/300' },
        { id: 6, type: 'Photo', title: 'Team', src: 'https://via.placeholder.com/300' },
    ];

    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>School Gallery</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {items.map(item => (
                    <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '200px', backgroundColor: 'var(--primary-color)', opacity: 0.8 }}>
                            <img src={item.src} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h3>{item.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>{item.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
