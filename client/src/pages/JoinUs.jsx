import React from 'react';

const JoinUs = () => {
    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '3rem' }}>Join Our Mission</h1>
            <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto', fontSize: '1.2rem', color: '#64748b' }}>
                Become a part of our journey to empower every student. Whether via time, skill, or funds, your contribution matters.
            </p>

            <div style={{ display: 'grid', gap: '3rem' }}>
                {/* Volunteer Section */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Volunteer With Us</h2>
                    <p style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
                        Dedicate your time to help in our classrooms, workshops, or events. We partner with local organizations to provide meaningful opportunities.
                    </p>
                    <button className="btn btn-primary">Sign Up to Volunteer</button>
                </div>

                {/* Careers Section */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--primary-color)' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Work With Us</h2>
                    <p style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
                        We are looking for special educators, therapists, and administrative staff. Check out our current openings.
                    </p>
                    <button className="btn btn-primary">View Openings</button>
                </div>

                {/* Donate Section */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid #10b981' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Donate</h2>
                    <p style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
                        Your donation directly funds therapy sessions, art supplies, and educational tools. All donations are tax-exempt under 80G.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-accent">Donate Once</button>
                        <button className="btn btn-primary">Monthly Giving</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinUs;
