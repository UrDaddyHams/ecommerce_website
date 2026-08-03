export default function Navbar({ activePage, onNavigate, cartCount, username, onLogout, userRole }) {
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';

  // Customer navigation links
  const links = [
    { key: 'products', label: 'Products', icon: '🏪' },
    { key: 'cart', label: 'Cart', icon: '🛒' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'shipments', label: 'Shipments', icon: '🚚' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand" onClick={() => onNavigate(isAdmin ? 'admin' : 'products')} style={{ cursor: 'pointer' }}>
            <span className="brand-icon">🛒</span>
            <span className="brand-text">
            Readers {isAdmin && <span className="admin-badge">(Admin)</span>}
          </span>
          </div>

          {/* Render customer links ONLY if the user is NOT an admin */}
          {!isAdmin && (
              <div className="navbar-links">
                {links.map((link) => (
                    <button
                        key={link.key}
                        id={`nav-${link.key}`}
                        className={`nav-link ${activePage === link.key ? 'active' : ''}`}
                        onClick={() => onNavigate(link.key)}
                    >
                      <span className="nav-icon">{link.icon}</span>
                      <span className="nav-label">{link.label}</span>
                      {link.key === 'cart' && cartCount > 0 && (
                          <span className="cart-badge">{cartCount}</span>
                      )}
                      {activePage === link.key && <div className="nav-indicator" />}
                    </button>
                ))}
              </div>
          )}

          {/* If user is admin, show a clean indicator or toggle if needed */}
          {isAdmin && (
              <div className="navbar-admin-indicator" style={{ color: '#7c3aed', fontWeight: '600', fontSize: '0.9rem' }}>
                🛠️ Control Panel Active
              </div>
          )}

          <div className="navbar-user">
            <div className="user-avatar">{(username || 'U')[0].toUpperCase()}</div>
            <span className="user-name">{username || 'User'}</span>
            <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
  );
}