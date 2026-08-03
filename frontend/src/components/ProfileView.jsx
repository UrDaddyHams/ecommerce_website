import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

export default function ProfileView() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [resolvedId, setResolvedId] = useState(localStorage.getItem('customerId'));
    const { showToast } = useToast();

    const userRole = localStorage.getItem('user_role');
    const username = localStorage.getItem('username');

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postal_code: '', // Updated to match database/backend snake_case
        country: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            const headers = { Authorization: `Bearer ${token}` };
            const customerId = localStorage.getItem('customerId');

            let customerData = null;

            if (customerId && customerId !== 'undefined' && customerId !== 'null') {
                try {
                    const res = await axios.get(`http://localhost:8081/api/customers/${customerId}`, { headers });
                    customerData = res.data;
                } catch (e) {
                    // Fallback
                }
            }

            if (!customerData) {
                try {
                    const res = await axios.get(`http://localhost:8081/api/customers/me`, { headers });
                    customerData = res.data;
                } catch (e) {
                    const allRes = await axios.get(`http://localhost:8081/api/customers`, { headers });
                    const customers = allRes.data || [];
                    customerData = customers.find(c =>
                        c.username === username ||
                        c.email === username ||
                        c.id_customer == customerId ||
                        c.idCustomer == customerId
                    ) || customers[0];
                }
            }

            if (customerData) {
                const realId = customerData.id_customer || customerData.customerId || customerData.id || customerId;
                setResolvedId(realId);
                localStorage.setItem('customerId', realId);

                const primaryAddress = customerData.addresses && customerData.addresses.length > 0
                    ? customerData.addresses[0]
                    : null;

                setForm({
                    first_name: customerData.first_name || customerData.firstName || '',
                    last_name: customerData.last_name || customerData.lastName || '',
                    email: customerData.email || '',
                    phone: customerData.phone || '',
                    street: primaryAddress?.street || '',
                    city: primaryAddress?.city || '',
                    postal_code: primaryAddress?.postal_code || primaryAddress?.postalCode || '',
                    country: primaryAddress?.country || '',
                });
            } else {
                throw new Error("No customer profile found");
            }
        } catch (err) {
            console.error('Failed to load profile:', err);
            setForm({
                first_name: username || 'User',
                last_name: '',
                email: '',
                phone: '',
                street: '',
                city: '',
                postal_code: '',
                country: '',
            });
            showToast('Loaded local profile fallback', 'info');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('jwt_token');

            // Send both camelCase and snake_code variants in address payload to guarantee backend mapping success
            const payload = {
                firstName: form.first_name,
                lastName: form.last_name,
                email: form.email,
                phone: form.phone,
                addresses: (form.street || form.city || form.postal_code || form.country) ? [{
                    street: form.street,
                    city: form.city,
                    postalCode: form.postal_code,
                    postal_code: form.postal_code,
                    country: form.country
                }] : []
            };

            await axios.put(`http://localhost:2021/api/customers/me`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast('Profile updated successfully! ✨', 'success');
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            console.error('Update error:', err);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const formattedDisplayAddress = [form.street, form.city, form.postal_code, form.country].filter(Boolean).join(', ');

    if (loading) {
        return (
            <div className="loading-state" style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner-lg" />
                <p>Loading profile details...</p>
            </div>
        );
    }

    return (
        <div className="page-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>My Profile</h1>
                    <p className="subtitle" style={{ color: '#666' }}>
                        Account: <strong>{username}</strong> · Role: <strong>{userRole === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}</strong>
                    </p>
                </div>
                {!isEditing && (
                    <button className="btn btn-secondary" onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        ✏️ Edit Profile & Address
                    </button>
                )}
            </div>

            <div className="profile-card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e1e4e8' }}>
                {!isEditing ? (
                    <div className="profile-view-details">
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>First Name</span>
                            <span style={{ fontSize: '1.1rem', color: '#333' }}>{form.first_name || '—'}</span>
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Last Name</span>
                            <span style={{ fontSize: '1.1rem', color: '#333' }}>{form.last_name || '—'}</span>
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Email Address</span>
                            <span style={{ fontSize: '1.1rem', color: '#333' }}>{form.email || '—'}</span>
                        </div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Phone Number</span>
                            <span style={{ fontSize: '1.1rem', color: '#333' }}>{form.phone || '—'}</span>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Delivery Address</span>
                            <span style={{ fontSize: '1.1rem', color: formattedDisplayAddress ? '#333' : '#d9534f' }}>
                                {formattedDisplayAddress || '⚠️ No delivery address added yet. Please add one before placing an order.'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave}>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>First Name</label>
                            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Last Name</label>
                            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone Number</label>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>

                        <hr style={{ margin: '1.5rem 0' }} />
                        <h3>Delivery Address</h3>

                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Street</label>
                            <input type="text" name="street" value={form.street} onChange={handleChange} className="form-control" placeholder="123 Main St" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>City</label>
                            <input type="text" name="city" value={form.city} onChange={handleChange} className="form-control" placeholder="City" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Postal Code</label>
                            <input type="text" name="postal_code" value={form.postal_code} onChange={handleChange} className="form-control" placeholder="Postal Code" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Country</label>
                            <input type="text" name="country" value={form.country} onChange={handleChange} className="form-control" placeholder="Country" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)} disabled={saving} style={{ padding: '10px 20px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}