import { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import ProductCatalog from './components/ProductCatalog';
import CartView from './components/CartView';
import OrderHistory from './components/OrderHistory';
import ShipmentTracking from './components/ShipmentTracking';
import ProfileView from './components/ProfileView';
import AdminDashboard from './components/AdminDashboard';
import { getAllCarts, createCart, getCartItems } from './api/apiClient';
import headerLogo from "./assets/book-attic-header.png";

const DEFAULT_CUSTOMER_ID = 1;

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('products');
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');

  const customerId = Number(localStorage.getItem('customerId')) || DEFAULT_CUSTOMER_ID;
  const userRole = localStorage.getItem('user_role');

  // Listen for auth expiration
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(false);
      setCartId(null);
      setCartCount(0);
    };
    window.addEventListener('auth-expired', handler);
    return () => window.removeEventListener('auth-expired', handler);
  }, []);

  const initCart = useCallback(async () => {
    if (userRole === 'ROLE_ADMIN') return;
    try {
      const res = await getAllCarts();
      const carts = res.data || [];
      const customerCart = carts.find((c) => c.idCustomer === customerId);
      if (customerCart) {
        setCartId(customerCart.idCart);
        setCartCount(customerCart.items?.length || 0);
      } else {
        const newCart = await createCart({
          idCustomer: customerId,
          createdDate: new Date().toISOString(),
        });
        setCartId(newCart.data.idCart);
        setCartCount(0);
      }
    } catch {}
  }, [customerId, userRole]);

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole !== 'ROLE_ADMIN') {
        initCart();
      } else {
        // Default admins to the admin page view on login
        setActivePage('admin');
      }
      setUsername(localStorage.getItem('username') || '');
    }
  }, [isAuthenticated, initCart, userRole]);

  const refreshCartCount = useCallback(async () => {
    if (!cartId || userRole === 'ROLE_ADMIN') return;
    try {
      const res = await getCartItems(cartId);
      setCartCount((res.data || []).length);
    } catch {
      try {
        const res = await getAllCarts();
        const carts = res.data || [];
        const customerCart = carts.find((c) => c.idCustomer === customerId);
        if (customerCart) {
          setCartCount(customerCart.items?.length || 0);
        }
      } catch {}
    }
  }, [cartId, customerId, userRole]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const role = localStorage.getItem('user_role');
    setActivePage(role === 'ROLE_ADMIN' ? 'admin' : 'products');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('customerId');
    localStorage.removeItem('adminId');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setActivePage('products');
    setCartId(null);
    setCartCount(0);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    // Handle admin page view cleanly through standard switch routing
    if (activePage === 'admin' && userRole === 'ROLE_ADMIN') {
      return <AdminDashboard />;
    }

    switch (activePage) {
      case 'products':
        return <ProductCatalog cartId={cartId} onCartUpdate={refreshCartCount} />;
      case 'cart':
        return (
            <CartView
                cartId={cartId}
                customerId={customerId}
                onCartUpdate={refreshCartCount}
                onNavigate={setActivePage}
            />
        );
      case 'orders':
        return <OrderHistory customerId={customerId} onNavigate={setActivePage} />;
      case 'shipments':
        return <ShipmentTracking customerId={customerId} />;
      case 'profile':
        return <ProfileView />;
      default:
        return <ProductCatalog cartId={cartId} onCartUpdate={refreshCartCount} />;
    }
  };

  return (
      <div className="app">

        <div className="full-width-banner">
          <img src={headerLogo} alt="Book Attic Header" />
        </div>
        <Navbar
            activePage={activePage}
            onNavigate={setActivePage}
            cartCount={cartCount}
            username={username}
            onLogout={handleLogout}
            userRole={userRole}
        />


        <main className="main-content">
          {renderPage()}
        </main>
      </div>
  );
}

export default function App() {
  return (
      <ToastProvider>
        <AppContent />
      </ToastProvider>
  );
}