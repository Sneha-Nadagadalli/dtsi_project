import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [role, setRole] = useState('');
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        studentName: '',
        buyLink: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/shop/products');
            setProducts(res.data);
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

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/shop/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newProduct.title);
            formData.append('price', newProduct.price);
            formData.append('studentName', newProduct.studentName);
            formData.append('description', newProduct.description);
            formData.append('buyLink', newProduct.buyLink);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await axios.post('/api/shop/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setNewProduct({ title: '', price: '', description: '', studentName: '', buyLink: '' });
            setImageFile(null);
            setPreviewUrl('');
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="section">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }}>Our Products</h1>

            {/* Mentor: Add Product Form */}
            {role === 'mentor' && (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto 3rem auto', borderTop: '4px solid var(--accent-color)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
                    <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            placeholder="Product Title"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            required
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            required
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            placeholder="Student Artist Name"
                            value={newProduct.studentName}
                            onChange={(e) => setNewProduct({ ...newProduct, studentName: e.target.value })}
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            placeholder="Purchase Link (URL)"
                            value={newProduct.buyLink}
                            onChange={(e) => setNewProduct({ ...newProduct, buyLink: e.target.value })}
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
                                minHeight: '100px',
                                position: 'relative'
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            {previewUrl ? null : "Drag & Drop Image or Click to Upload"}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <textarea
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            required
                            style={{ gridColumn: '1 / -1', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        ></textarea>
                        <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>List Product</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {products.length === 0 ? <p style={{ textAlign: 'center', width: '100%' }}>No products available yet.</p> : (
                    products.map(product => (
                        <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '250px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#64748b' }}>No Image</span>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: 'auto' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>By {product.studentName || 'Student Artist'}</p>
                                    <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '1rem' }}>{product.description}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-color)' }}>₹{product.price}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {product.buyLink ? (
                                            <a
                                                href={product.buyLink.startsWith('http') ? product.buyLink : `https://${product.buyLink}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', textDecoration: 'none', display: 'inline-block' }}
                                            >
                                                Buy Now
                                            </a>
                                        ) : (
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Purchase link coming soon!')}>Buy</button>
                                        )}
                                        {role === 'mentor' && (
                                            <button
                                                className="btn"
                                                onClick={() => handleDeleteProduct(product._id)}
                                                style={{ padding: '0.5rem 1rem', backgroundColor: '#4a90e2', color: 'white', border: 'none' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Shop;
