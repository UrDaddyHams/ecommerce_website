import { useState } from 'react';

export default function Navbar({ activePage, onNavigate, cartCount, username, onLogout, userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = userRole === 'ROLE_ADMIN' || userRole === 'ADMIN';

  const links = [
    { key: 'products', label: 'Products'},
    { key: 'cart', label: 'Cart'},
    { key: 'orders', label: 'Orders' },
    { key: 'shipments', label: 'Shipments'},
    { key: 'profile', label: 'Profile'},
  ];

  const handleNavClick = (key) => {
    onNavigate(key);
    setSidebarOpen(false);
  };

  return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            {/* Menu Toggle Button */}
            {!isAdmin ? (
                <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)}>
                  <span className="hamburger-icon">☰</span>
                  <span className="menu-text">Menu</span>
                </button>
            ) : (
                <div className="navbar-admin-label">Admin Control Panel</div>
            )}
          </div>
        </nav>

        {/* Smooth Sliding Sidebar Drawer */}
        <div
            className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
        >
          <div className="sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Navigation</h3>
              <button className="close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            <div className="sidebar-user-profile">
              <div className="user-avatar">{(username || 'U')[0].toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">{username || 'User'}</span>
                <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="sidebar-nav-links">
              {links.map((link) => (
                  <button
                      key={link.key}
                      className={`sidebar-link ${activePage === link.key ? 'active' : ''}`}
                      onClick={() => handleNavClick(link.key)}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                    {link.key === 'cart' && cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </>
  );
}