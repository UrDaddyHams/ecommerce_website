import { useState, useEffect } from 'react';
import {
    getAllShipments, getProducts, getCategories
} from '../api/apiClient';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('shipments');
    const [shipments, setShipments] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Form states
    const [newProduct, setNewProduct] = useState({ nameProduct: '', price: '', stockQuantity: '', description: '', idCategory: '', idSupplier: '' });
    const [newCategory, setNewCategory] = useState({ categoryName: '', description: '' });
    const [newSupplier, setNewSupplier] = useState({ supplierName: '', phone: '', email: '' });

    // Edit state for Supplier
    const [editingSupplierId, setEditingSupplierId] = useState(null);
    const [editSupplierData, setEditSupplierData] = useState({ supplierName: '', phone: '', email: '' });

    useEffect(() => {
        fetchAllData();
    }, [activeTab]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            const headers = { Authorization: `Bearer ${token}` };

            const [shipRes, prodRes, catRes, supRes, payRes, userRes] = await Promise.allSettled([
                getAllShipments(),
                getProducts(0, 100),
                getCategories(),
                axios.get('/api/suppliers', { headers }),
                axios.get('/api/payments', { headers }),
                axios.get('/api/customers', { headers })
            ]);

            if (shipRes.status === 'fulfilled') setShipments(shipRes.value.data || []);
            if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.content || prodRes.value.data || []);
            if (catRes.status === 'fulfilled') setCategories(catRes.value.data || []);
            if (supRes.status === 'fulfilled') setSuppliers(supRes.value.data || []);
            if (payRes.status === 'fulfilled') setPayments(payRes.value.data || []);
            if (userRes.status === 'fulfilled') setUsers(userRes.value.data || []);
        } catch (err) {
            showToast('Failed to load full admin data ecosystem', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.post('/api/products', newProduct, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Product added successfully!', 'success');
            setNewProduct({ nameProduct: '', price: '', stockQuantity: '', description: '', idCategory: '', idSupplier: '' });
            fetchAllData();
        } catch (err) {
            showToast('Failed to create product', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm(`Are you sure you want to delete product ID: ${id}?`)) return;
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Product deleted successfully', 'success');
            fetchAllData();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete product (It may be tied to existing orders)', 'error');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.post('/api/categories', newCategory, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Category added!', 'success');
            setNewCategory({ categoryName: '', description: '' });
            fetchAllData();
        } catch (err) {
            showToast('Failed to add category', 'error');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete category?')) return;
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.delete(`/api/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Category deleted', 'success');
            fetchAllData();
        } catch (err) {
            showToast('Failed to delete category', 'error');
        }
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.post('/api/suppliers', newSupplier, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Supplier added successfully!', 'success');
            setNewSupplier({ supplierName: '', phone: '', email: '' });
            fetchAllData();
        } catch (err) {
            showToast('Failed to add supplier', 'error');
        }
    };

    const handleStartEditSupplier = (supplier) => {
        setEditingSupplierId(supplier.idSupplier || supplier.id);
        setEditSupplierData({
            supplierName: supplier.supplierName || supplier.nameSupplier || supplier.name || '',
            phone: supplier.phone || '',
            email: supplier.email || ''
        });
    };

    const handleUpdateSupplier = async (id) => {
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.put(`/api/suppliers/${id}`, editSupplierData, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Supplier updated successfully!', 'success');
            setEditingSupplierId(null);
            fetchAllData();
        } catch (err) {
            showToast('Failed to update supplier', 'error');
        }
    };

    const handleDeleteSupplier = async (id) => {
        if (!window.confirm(`Are you sure you want to delete supplier ID: ${id}?`)) return;
        try {
            const token = localStorage.getItem('jwt_token');
            await axios.delete(`/api/suppliers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showToast('Supplier deleted successfully', 'success');
            fetchAllData();
        } catch (err) {
            showToast(err.response?.data || 'Failed to delete supplier (It may be tied to existing products)', 'error');
        }
    };

    // Reusable professional input style configuration
    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '0.95rem',
        outline: 'none',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
    };

    return (
        <div className="page-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1>🛠️ System Admin Control Panel</h1>
                    <p className="subtitle" style={{ color: '#64748b' }}>Full CRUD & Global Database Management</p>
                </div>
                <button className="btn btn-ghost" onClick={fetchAllData} style={{ cursor: 'pointer' }}>↻ Refresh Data</button>
            </div>

            {/* Admin Navigation Sub-Tabs */}
            <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['shipments', 'products', 'categories', 'suppliers', 'payments', 'users'].map((tab) => (
                    <button
                        key={tab}
                        className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ textTransform: 'capitalize', cursor: 'pointer' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner-lg" /><p>Loading management records...</p></div>
            ) : (
                <div className="admin-tab-content">

                    {/* SHIPMENTS TAB */}
                    {activeTab === 'shipments' && (
                        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <h3>All Global Shipments & Orders ({shipments.length})</h3>
                            <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Shipment ID</th>
                                    <th style={{ padding: '10px' }}>Order ID</th>
                                    <th style={{ padding: '10px' }}>Tracking #</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Ship Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {shipments.map((s) => (
                                    <tr key={s.idShipment} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px' }}>#{s.idShipment}</td>
                                        <td style={{ padding: '10px' }}>#{s.idOrder || s.order?.idOrder}</td>
                                        <td style={{ padding: '10px' }}>{s.trackingNumber}</td>
                                        <td style={{ padding: '10px' }}><span className="badge status-processing">{s.status}</span></td>
                                        <td style={{ padding: '10px' }}>{s.shippingDate ? new Date(s.shippingDate).toLocaleDateString() : '—'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PRODUCTS TAB (CRUD) */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
                                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                    <input type="text" placeholder="Product Name" style={inputStyle} value={newProduct.nameProduct} onChange={(e)=>setNewProduct({...newProduct, nameProduct: e.target.value})} required />
                                    <input type="number" placeholder="Price" style={inputStyle} value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct, price: e.target.value})} required />
                                    <input type="number" placeholder="Stock Quantity" style={inputStyle} value={newProduct.stockQuantity} onChange={(e)=>setNewProduct({...newProduct, stockQuantity: e.target.value})} required />
                                    <input type="text" placeholder="Description" style={inputStyle} value={newProduct.description} onChange={(e)=>setNewProduct({...newProduct, description: e.target.value})} />
                                    <input type="number" placeholder="Category ID" style={inputStyle} value={newProduct.idCategory} onChange={(e)=>setNewProduct({...newProduct, idCategory: e.target.value})} />
                                    <input type="number" placeholder="Supplier ID" style={inputStyle} value={newProduct.idSupplier} onChange={(e)=>setNewProduct({...newProduct, idSupplier: e.target.value})} />
                                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '10px', cursor: 'pointer' }}>Add Product</button>
                                </form>
                            </div>

                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <h3>Catalog Products ({products.length})</h3>
                                <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Name</th>
                                        <th style={{ padding: '10px' }}>Price</th>
                                        <th style={{ padding: '10px' }}>Stock</th>
                                        <th style={{ padding: '10px' }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((p) => (
                                        <tr key={p.idProduct || p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px' }}>#{p.idProduct || p.id}</td>
                                            <td style={{ padding: '10px' }}>{p.nameProduct || p.name}</td>
                                            <td style={{ padding: '10px' }}>${p.price}</td>
                                            <td style={{ padding: '10px' }}>{p.stockQuantity || p.stock}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button className="btn btn-ghost" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteProduct(p.idProduct || p.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* CATEGORIES TAB (CRUD) */}
                    {activeTab === 'categories' && (
                        <div>
                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Add Category</h3>
                                <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Category Name"
                                        style={inputStyle}
                                        value={newCategory.categoryName}
                                        onChange={(e)=>setNewCategory({...newCategory, categoryName: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        style={inputStyle}
                                        value={newCategory.description}
                                        onChange={(e)=>setNewCategory({...newCategory, description: e.target.value})}
                                    />
                                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', cursor: 'pointer' }}>Add Category</button>
                                </form>
                            </div>
                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <h3>Categories List ({categories.length})</h3>
                                <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Category Name</th>
                                        <th style={{ padding: '10px' }}>Description</th>
                                        <th style={{ padding: '10px' }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {categories.map((c) => (
                                        <tr key={c.idCategory || c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px' }}>#{c.idCategory || c.id}</td>
                                            <td style={{ padding: '10px' }}>{c.categoryName || c.name}</td>
                                            <td style={{ padding: '10px' }}>{c.description || '—'}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button className="btn btn-ghost" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteCategory(c.idCategory || c.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SUPPLIERS TAB (CRUD) */}
                    {activeTab === 'suppliers' && (
                        <div>
                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Add New Supplier</h3>
                                <form onSubmit={handleAddSupplier} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                    <input type="text" placeholder="Supplier Name" style={inputStyle} value={newSupplier.supplierName} onChange={(e)=>setNewSupplier({...newSupplier, supplierName: e.target.value})} required />
                                    <input type="text" placeholder="Phone" style={inputStyle} value={newSupplier.phone} onChange={(e)=>setNewSupplier({...newSupplier, phone: e.target.value})} />
                                    <input type="email" placeholder="Email" style={inputStyle} value={newSupplier.email} onChange={(e)=>setNewSupplier({...newSupplier, email: e.target.value})} />
                                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '10px', cursor: 'pointer' }}>Add Supplier</button>
                                </form>
                            </div>

                            <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <h3>Suppliers Directory ({suppliers.length})</h3>
                                <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Supplier Name</th>
                                        <th style={{ padding: '10px' }}>Phone</th>
                                        <th style={{ padding: '10px' }}>Contact Email</th>
                                        <th style={{ padding: '10px' }}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {suppliers.map((s) => {
                                        const supplierId = s.idSupplier || s.id;
                                        const isEditing = editingSupplierId === supplierId;

                                        return (
                                            <tr key={supplierId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px' }}>#{supplierId}</td>
                                                <td style={{ padding: '10px' }}>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            style={inputStyle}
                                                            value={editSupplierData.supplierName}
                                                            onChange={(e) => setEditSupplierData({...editSupplierData, supplierName: e.target.value})}
                                                        />
                                                    ) : (
                                                        s.supplierName || s.nameSupplier || s.name
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px' }}>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            style={inputStyle}
                                                            value={editSupplierData.phone}
                                                            onChange={(e) => setEditSupplierData({...editSupplierData, phone: e.target.value})}
                                                        />
                                                    ) : (
                                                        s.phone || '—'
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px' }}>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            style={inputStyle}
                                                            value={editSupplierData.email}
                                                            onChange={(e) => setEditSupplierData({...editSupplierData, email: e.target.value})}
                                                        />
                                                    ) : (
                                                        s.email || '—'
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px' }}>
                                                    {isEditing ? (
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }} onClick={() => handleUpdateSupplier(supplierId)}>Save</button>
                                                            <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }} onClick={() => setEditingSupplierId(null)}>Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button className="btn btn-ghost" style={{ cursor: 'pointer' }} onClick={() => handleStartEditSupplier(s)}>Edit</button>
                                                            <button className="btn btn-ghost" style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteSupplier(supplierId)}>Delete</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === 'payments' && (
                        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <h3>System Payments Log ({payments.length})</h3>
                            <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Payment ID</th>
                                    <th style={{ padding: '10px' }}>Order ID</th>
                                    <th style={{ padding: '10px' }}>Amount</th>
                                    <th style={{ padding: '10px' }}>Payment Method</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {payments.map((pay) => (
                                    <tr key={pay.idPayment || pay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px' }}>#{pay.idPayment || pay.id}</td>
                                        <td style={{ padding: '10px' }}>#{pay.idOrder || pay.order?.idOrder}</td>
                                        <td style={{ padding: '10px' }}>${pay.amount}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                                {pay.paymentMethod || 'Credit Card'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}><span className="badge status-delivered">{pay.status || 'Completed'}</span></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <h3>Registered Customers ({users.length})</h3>
                            <table className="admin-table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Customer ID</th>
                                    <th style={{ padding: '10px' }}>Username</th>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Email</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((u) => (
                                    <tr key={u.idCustomer || u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px' }}>#{u.idCustomer || u.id}</td>
                                        <td style={{ padding: '10px' }}>{u.username}</td>
                                        <td style={{ padding: '10px' }}>{u.firstName} {u.lastName}</td>
                                        <td style={{ padding: '10px' }}>{u.email}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}