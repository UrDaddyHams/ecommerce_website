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
        {/* Adjusted top and left padding here so it doesn't touch the edge */}
        <nav className="navbar" style={{ paddingTop: '125px', paddingLeft: '16px' }}>
          <div className="navbar-inner">
            {/* Menu Toggle Button / Admin Label */}
            {!isAdmin ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Menu Button */}
                  <button
                      className="menu-toggle-btn"
                      onClick={() => setSidebarOpen(true)}
                      style={{ padding: '18px 18px', fontSize: '1rem' }}
                  >
                    <span className="hamburger-icon">☰</span>
                    <span className="menu-text">Menu</span>
                  </button>

                  {/* External Quick Cart Button */}
                  <button
                      className="menu-toggle-btn"
                      onClick={() => onNavigate('cart')}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '20px 20px',
                        fontSize: '1rem'
                      }}
                  >
                    <span></span>
                    <span className="menu-text">Cart</span>
                    {cartCount > 0 && (
                        <span className="cart-badge" style={{ marginLeft: 'auto', background: '#a6957c', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
            ) : (
                <div className="navbar-admin-label"></div>
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