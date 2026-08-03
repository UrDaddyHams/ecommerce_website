import { useState } from 'react';
import { login, register } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register({
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          role: 'ROLE_USER',
        });
        showToast('Account created! You can now log in and add your address from your profile.', 'success');
        setIsRegister(false);
      } else {
        const res = await login(form.username, form.password);
        const { token, idCustomer, customerId, idAdmin, role } = res.data;

        localStorage.setItem('jwt_token', token);
        localStorage.setItem('username', form.username);
        localStorage.setItem('user_role', role || 'ROLE_USER');

        if (role === 'ROLE_ADMIN') {
          localStorage.setItem('adminId', idAdmin);
          localStorage.removeItem('customerId');
        } else {
          const resolvedCustomerId = idCustomer || customerId;
          if (!resolvedCustomerId) {
            showToast('Login error: Customer ID missing from server response.', 'error');
            return;
          }
          localStorage.setItem('customerId', resolvedCustomerId);
          localStorage.removeItem('adminId');
        }

        showToast('Welcome back!', 'success');
        onLogin();
      }
    } catch (err) {
      showToast('Authentication failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">🛒</div>
            <h1>Readers</h1>
            <p>{isRegister ? 'Create your account' : 'Sign in to continue (User or Admin)'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="Enter username" value={form.username} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
            </div>

            {isRegister && (
                <>
                  <div className="input-group"><label>First Name</label><input type="text" name="firstName" value={form.firstName} onChange={handleChange} /></div>
                  <div className="input-group"><label>Last Name</label><input type="text" name="lastName" value={form.lastName} onChange={handleChange} /></div>
                  <div className="input-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} /></div>
                  <div className="input-group"><label>Phone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} /></div>
                </>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="spinner" /> : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
            <button className="btn-link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
  );
}