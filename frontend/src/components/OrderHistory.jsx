import { useState, useEffect } from 'react';
import { getOrdersByCustomer } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

export default function OrderHistory({ customerId, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersByCustomer(customerId);
      const data = res.data || [];
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') return 'badge-success';
    if (s === 'SHIPPED' || s === 'IN_TRANSIT') return 'badge-info';
    if (s === 'PENDING' || s === 'PROCESSING') return 'badge-warning';
    if (s === 'CANCELLED') return 'badge-danger';
    return 'badge-default';
  };

  return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Order History</h1>
            <p className="subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          <button className="btn btn-ghost" onClick={fetchOrders}>↻ Refresh</button>
        </div>

        {loading ? (
            <div className="loading-state">
              <div className="spinner-lg" />
              <p>Loading orders...</p>
            </div>
        ) : orders.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No orders yet</h3>
              <p>Your order history will appear here after your first purchase.</p>
              <button className="btn btn-primary" onClick={() => onNavigate?.('products')}>
                Start Shopping
              </button>
            </div>
        ) : (
            <div className="orders-list">
              {orders.map((order) => {
                const firstItem = order.orderItems?.[0];
                const primaryProductName = firstItem?.product?.productName || `Product #${firstItem?.idProduct || order.idOrder}`;
                const extraCount = (order.orderItems?.length || 1) - 1;

                return (
                    <div key={order.idOrder} className="order-card">
                      {/* Header: Displays Product Name instead of Order ID */}
                      <div
                          className="order-card-header"
                          onClick={() => setExpandedOrder(expandedOrder === order.idOrder ? null : order.idOrder)}
                      >
                        <div className="order-id">
                          <span style={{ fontWeight: 600 }}>{primaryProductName}</span>
                          {extraCount > 0 && <span className="subtitle"> (+{extraCount} more)</span>}
                        </div>
                        <div className="order-meta">
                          <span className="order-date">{formatDate(order.orderDate)}</span>
                          <span className={`badge ${getStatusBadge(order.status)}`}>{order.status || 'Unknown'}</span>
                        </div>
                        <div className="order-total">${order.totalAmount?.toFixed(2)}</div>
                        <span className={`expand-icon ${expandedOrder === order.idOrder ? 'expanded' : ''}`}>
                    ▾
                  </span>
                      </div>

                      {/* Details Table: Product, Date, Qty, Price (Subtotal removed) */}
                      {expandedOrder === order.idOrder && (
                          <div className="order-details">
                            <div className="order-items-table">
                              <div className="table-header">
                                <span>PRODUCT</span>
                                <span>DATE</span>
                                <span>QTY</span>
                                <span>PRICE</span>
                              </div>
                              {(order.orderItems || []).map((item) => (
                                  <div key={item.idOrderItem} className="table-row">
                          <span className="item-name">
                            {item.product?.productName || `Product #${item.idProduct}`}
                          </span>
                                    <span>{formatDate(order.orderDate)}</span>
                                    <span>{item.quantity}</span>
                                    <span>${item.price?.toFixed(2)}</span>
                                  </div>
                              ))}
                            </div>

                            {/* Payment Info */}
                            {order.payment && (
                                <div className="order-payment-info">
                                  <h4>Payment</h4>
                                  <div className="info-grid">
                                    <div><span className="info-label">Method</span><span>{order.payment.paymentMethod || '—'}</span></div>
                                    <div><span className="info-label">Status</span><span className={`badge ${getStatusBadge(order.payment.status)}`}>{order.payment.status || '—'}</span></div>
                                    <div><span className="info-label">Amount</span><span>${order.payment.amount?.toFixed(2)}</span></div>
                                    <div><span className="info-label">Date</span><span>{formatDate(order.payment.paymentDate)}</span></div>
                                  </div>
                                </div>
                            )}

                            {/* Shipment Link */}
                            {order.shipment && (
                                <div className="order-shipment-link">
                                  <button className="btn btn-sm btn-ghost" onClick={() => onNavigate?.('shipments')}>
                                    🚚 View Shipment Tracking →
                                  </button>
                                </div>
                            )}
                          </div>
                      )}
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}