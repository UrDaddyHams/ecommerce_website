import { useState, useEffect } from 'react';
import { getCartById, getCartItems, updateCartItem, removeCartItem, checkout } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

export default function CartView({ cartId, userId, onCartUpdate, onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [updatingItem, setUpdatingItem] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const { showToast } = useToast();

  useEffect(() => {
    if (cartId) fetchCartItems();
    else setLoading(false);
  }, [cartId]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const res = await getCartItems(cartId);
      setItems(res.data || []);
    } catch (err) {
      try {
        const cartRes = await getCartById(cartId);
        setItems(cartRes.data?.items || []);
      } catch {
        showToast('Failed to load cart', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return handleRemove(item);

    setUpdatingItem((prev) => ({ ...prev, [item.idCartItem]: true }));
    try {
      await updateCartItem(item.idCartItem, cartId, item.product.idProduct, newQty);
      setItems((prev) =>
          prev.map((i) => (i.idCartItem === item.idCartItem ? { ...i, quantity: newQty } : i))
      );
      onCartUpdate?.();
    } catch (err) {
      showToast('Failed to update quantity', 'error');
    } finally {
      setUpdatingItem((prev) => ({ ...prev, [item.idCartItem]: false }));
    }
  };

  const handleRemove = async (item) => {
    setUpdatingItem((prev) => ({ ...prev, [item.idCartItem]: true }));
    try {
      await removeCartItem(item.idCartItem);
      setItems((prev) => prev.filter((i) => i.idCartItem !== item.idCartItem));
      showToast(`${item.product?.productName || 'Item'} removed`, 'info');
      onCartUpdate?.();
    } catch (err) {
      showToast('Failed to remove item', 'error');
    } finally {
      setUpdatingItem((prev) => ({ ...prev, [item.idCartItem]: false }));
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const customerId = localStorage.getItem('customerId');
      const headers = { Authorization: `Bearer ${token}` };

      let customerData = null;

      // Fetch customer data robustly using local ID or /me endpoint fallback
      if (customerId && customerId !== 'undefined' && customerId !== 'null') {
        try {
          const customerRes = await axios.get(`http://localhost:2021/api/customers/${customerId}`, { headers });
          customerData = customerRes.data;
        } catch (e) {
          console.warn("Failed fetching by customerId, trying /me fallback...");
        }
      }

      if (!customerData) {
        const meRes = await axios.get(`http://localhost:2021/api/customers/me`, { headers });
        customerData = meRes.data;
      }

      const hasAddress = customerData && customerData.addresses && customerData.addresses.length > 0;

      if (!hasAddress) {
        showToast('Please add a delivery address in your profile before placing an order!', 'error');
        setTimeout(() => onNavigate?.('profile'), 1500);
        setCheckingOut(false);
        return;
      }

      await checkout(paymentMethod);
      showToast(`Order placed successfully with ${paymentMethod}! 🎉`, 'success');
      setItems([]);
      onCartUpdate?.();
      setTimeout(() => onNavigate?.('orders'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Checkout failed: Please ensure your profile has an address saved.';
      showToast(typeof msg === 'string' ? msg : 'Checkout failed', 'error');
    } finally {
      setCheckingOut(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Shopping Cart</h1>
            <p className="subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        {loading ? (
            <div className="loading-state">
              <div className="spinner-lg" />
              <p>Loading cart...</p>
            </div>
        ) : items.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Browse products and add items to get started.</p>
              <button className="btn btn-primary" onClick={() => onNavigate?.('products')}>
                Browse Products
              </button>
            </div>
        ) : (
            <div className="cart-layout">
              <div className="cart-items-list">
                {items.map((item) => (
                    <div key={item.idCartItem} className="cart-item-card">
                      <div className="cart-item-image">
                        <span>📦</span>
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.product?.productName || 'Unknown Product'}</h3>
                        <p className="cart-item-price">${item.product?.price?.toFixed(2)} each</p>
                      </div>
                      <div className="cart-item-quantity">
                        <button
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item, -1)}
                            disabled={updatingItem[item.idCartItem]}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item, 1)}
                            disabled={updatingItem[item.idCartItem]}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-total">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                      <button
                          className="btn btn-ghost btn-sm cart-item-remove"
                          onClick={() => handleRemove(item)}
                          disabled={updatingItem[item.idCartItem]}
                          title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>

                  <div className="summary-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', margin: '15px 0' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Payment Method:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="Credit Card">Credit Card 💳</option>
                      <option value="PayPal">PayPal 🅿️</option>
                      <option value="Cash on Delivery">Cash on Delivery 💵</option>
                    </select>
                  </div>

                  <hr />
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <button
                      id="btn-checkout"
                      className="btn btn-primary btn-block"
                      onClick={handleCheckout}
                      disabled={checkingOut}
                  >
                    {checkingOut ? <span className="spinner" /> : `Pay with ${paymentMethod}`}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}