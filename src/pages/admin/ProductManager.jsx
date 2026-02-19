import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Image as ImageIcon, Download } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductManager.css';

// In dev: leave empty (Vite proxies /api and /uploads). On Netlify: set to your backend URL (e.g. https://your-app.onrender.com)
const API_BASE = import.meta.env.VITE_API_URL || '';

const ProductManager = () => {
    const { products, getAllProducts, addProduct, updateProduct, deleteProduct } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        priceNum: 0,
        category: 'NEW IN',
        description: '',
        images: [''],
        sizes: 'XXS,XS,S,M,L,XL',
        details: ''
    });

    const allProducts = getAllProducts();
    const categories = ['ALL', ...Object.keys(products)];

    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'ALL' || p.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                id: product.id,
                name: product.name,
                price: product.price,
                priceNum: product.priceNum || parseInt(product.price.replace(/[^\d]/g, '')),
                category: product.category,
                description: product.description || '',
                images: product.images || [product.img],
                sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : 'XXS,XS,S,M,L,XL',
                details: Array.isArray(product.details) ? product.details.join('\n') : ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                id: '',
                name: '',
                price: '',
                priceNum: 0,
                category: 'NEW IN',
                description: '',
                images: [''],
                sizes: 'XXS,XS,S,M,L,XL',
                details: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            priceNum: name === 'price' ? parseInt(value.replace(/[^\d]/g, '')) || 0 : prev.priceNum
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const uploadImages = async (files) => {
        if (!files?.length) return;
        setUploadError(null);
        setUploading(true);
        try {
            const formDataUpload = new FormData();
            Array.from(files).forEach((file) => formDataUpload.append('images', file));
            const res = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            const base = API_BASE.replace(/\/$/, '');
            const newUrls = (data.urls || []).map((u) => (u.startsWith('http') ? u : `${base}${u}`));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images.filter(img => img !== ''), ...newUrls],
            }));
        } catch (err) {
            setUploadError(err.message || 'Failed to upload. Start the server (npm run server) to save images to the project.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalProduct = {
            ...formData,
            id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '-'),
            sizes: formData.sizes.split(',').map(s => s.trim()),
            details: formData.details.split('\n').filter(d => d.trim()),
            price: formData.price.startsWith('RS.') ? formData.price : `RS. ${formData.price}`
        };

        if (editingProduct) {
            updateProduct(finalProduct);
        } else {
            addProduct(finalProduct);
        }

        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (productId) => {
        if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS PRODUCT?')) {
            deleteProduct(productId);
        }
    };

    const handleExportProducts = () => {
        const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'products.json';
        a.click();
        URL.revokeObjectURL(a.href);
    };

    return (
        <div className="product-manager">
            <header className="pm-header">
                <div className="pm-actions-top">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH PRODUCTS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button className="add-btn" onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        ADD PRODUCT
                    </button>
                    <button type="button" className="export-btn" onClick={handleExportProducts} title="Export catalog for deploy (save as public/products.json, then build & redeploy)">
                        <Download size={18} />
                        EXPORT FOR DEPLOY
                    </button>
                </div>
            </header>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>IMAGE</th>
                            <th>PRODUCT ID</th>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>PRICE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="pm-img-preview">
                                        <img src={product.images?.[0] || product.img} alt={product.name} />
                                    </div>
                                </td>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>
                                    <div className="pm-row-actions">
                                        <button className="edit-btn" onClick={() => handleOpenModal(product)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form className="admin-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>PRODUCT NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. SCARLET TOP"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CATEGORY</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="NEW IN">NEW IN</option>
                                        <option value="TOPS">TOPS</option>
                                        <option value="DRESSES">DRESSES</option>
                                        <option value="BOTTOMS">BOTTOMS</option>
                                        <option value="UPCOMING">UPCOMING</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>PRICE (RS.)</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 4290"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>SIZES (COMMA SEPARATED)</label>
                                    <input
                                        type="text"
                                        name="sizes"
                                        value={formData.sizes}
                                        onChange={handleInputChange}
                                        placeholder="XXS, XS, S, M, L, XL"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>DESCRIPTION</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>PRODUCT DETAILS (ONE PER LINE)</label>
                                <textarea
                                    name="details"
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="e.g.&#10;100% Cotton&#10;Dry Clean Only&#10;Made in Italy"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>IMAGES (UPLOAD OR PASTE URL)</label>
                                <p className="image-hint">Upload images to save them in the project; they will be available when deployed. Or paste an image URL.</p>
                                {uploadError && <p className="upload-error">{uploadError}</p>}
                                {formData.images.map((url, index) => (
                                    <div key={index} className="image-input-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <input
                                            type="text"
                                            value={typeof url === 'string' ? url : ''}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder="/uploads/... or https://..."
                                        />
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(index)} className="remove-img-btn">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="image-upload-actions">
                                    <button type="button" className="add-img-btn" onClick={addImageField}>
                                        <Plus size={14} /> ADD URL FIELD
                                    </button>
                                    <label className={`upload-btn ${uploading ? 'uploading' : ''}`}>
                                        <ImageIcon size={14} /> {uploading ? 'UPLOADING...' : 'UPLOAD IMAGES (saved to project)'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files?.length) {
                                                    uploadImages(files);
                                                    e.target.value = '';
                                                }
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                                <button type="submit" className="save-btn">{editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
