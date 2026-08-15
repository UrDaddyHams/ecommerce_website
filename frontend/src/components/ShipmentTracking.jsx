import { useState, useEffect } from 'react';
import { getOrdersByCustomer, getShipmentByOrderId, getAllShipments, getShipmentsByUser, getOrdersByUser } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

const STEPS = ['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'];

export default function ShipmentTracking({ userId }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchShipments();
  }, [userId]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem('user_role');

      if (userRole === 'ROLE_ADMIN') {
        const res = await getAllShipments();
        setShipments(res.data || []);
        setLoading(false);
        return;
      }

      const effectiveUserId = userId || localStorage.getItem('customerId');
      if (!effectiveUserId) {
        setShipments([]);
        setLoading(false);
        return;
      }

      const res = await getShipmentsByUser(effectiveUserId);
      let shipmentsData = res.data || [];

      if (shipmentsData.length === 0) {
        const ordersRes = await getOrdersByUser(effectiveUserId);
        shipmentsData = (ordersRes.data || []).map((order) => ({
          idShipment: order.idOrder,
          idOrder: order.idOrder,
          status: 'PROCESSING',
          shippingDate: order.orderDate,
          trackingNumber: 'Pending assignment',
          order: order,
        }));
      }

      setShipments(shipmentsData);
    } catch (err) {
      showToast('Failed to load shipments', 'error');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getStepIndex = (status) => {
    const s = (status || '').toUpperCase().replace(' ', '_');
    if (s === 'DELIVERED') return 4;
    if (s === 'IN_TRANSIT') return 3;
    if (s === 'SHIPPED') return 2;
    return 1;
  };

  const getStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED') return 'status-delivered';
    if (s === 'IN_TRANSIT') return 'status-transit';
    if (s === 'SHIPPED') return 'status-shipped';
    return 'status-processing';
  };

  return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Shipment Tracking {localStorage.getItem('user_role') === 'ROLE_ADMIN' ? '(Admin View)' : ''}</h1>
            <p className="subtitle">{shipments.length} shipment{shipments.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-ghost" onClick={fetchShipments}>↻ Refresh</button>
        </div>

        {loading ? (
            <div className="loading-state">
              <div className="spinner-lg" />
              <p>Loading shipments...</p>
            </div>
        ) : shipments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🚚</span>
              <h3>No shipments found</h3>
              <p>Shipment tracking will appear here once orders are processed.</p>
            </div>
        ) : (
            <div className="shipments-list">
              {[...shipments].reverse().map((shipment, index) => {
                if (!shipment) return null;

                const stepIdx = getStepIndex(shipment.status);
                const userShipmentNum = shipments.length - index;

                // Safe extraction of all items in the order
                const items = shipment.order?.orderItems || shipment.order?.items || [];

                // Get all product names for the header summary
                const itemNames = items.map(item => item.product?.productName || item.productName || 'Book Item');
                const displayProductNames = itemNames.length > 0 ? itemNames.join(', ') : (shipment.productName || 'Book Item');

                return (
                    <div key={shipment.idShipment || index} className="shipment-card">
                      <div className="shipment-header">
                        <div>
                          <h3>
                            Shipment #{userShipmentNum} · {displayProductNames}
                          </h3>
                          <p className="shipment-order">
                            Ordered {formatDate(shipment.order?.orderDate || shipment.shippingDate)}
                            {shipment.order?.totalAmount != null && (
                                <span className="shipment-total"> · ${Number(shipment.order.totalAmount).toFixed(2)}</span>
                            )}
                          </p>
                        </div>

                        <span className={`badge ${getStatusColor(shipment.status)}`}>
                          {shipment.status || 'Unknown'}
                        </span>
                      </div>

                      {/* Full Order Items Breakdown Section */}
                      {items.length > 0 && (
                          <div className="shipment-items-section" style={{ marginTop: '10px', marginBottom: '14px', padding: '10px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: '6px' }}>
                            <span className="info-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Full Order Items ({items.length})</span>
                            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {items.map((item, idx) => {
                                const pName = item.product?.productName || 'Book Item';
                                const qty = item.quantity || 1;
                                const price = item.price != null ? ` — $${(item.price * qty).toFixed(2)}` : '';
                                return (
                                    <li key={idx}>
                                      {pName} {qty > 1 ? `(Qty: ${qty})` : ''} {price}
                                    </li>
                                );
                              })}
                            </ul>
                          </div>
                      )}

                      <div className="shipment-info-grid">
                        <div className="info-item">
                          <span className="info-label">Tracking Number</span>
                          <span className="tracking-number">{shipment.trackingNumber || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Ship Date</span>
                          <span>{formatDate(shipment.shippingDate)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Expected Delivery</span>
                          <span>{formatDate(shipment.deliveryDate)}</span>
                        </div>
                      </div>

                      <div className="shipment-timeline">
                        {STEPS.map((step, i) => {
                          const isActive = i < stepIdx;
                          const isCurrent = i === stepIdx - 1;
                          return (
                              <div key={step} className={`timeline-step ${isActive ? 'step-active' : ''} ${isCurrent ? 'step-current' : ''}`}>
                                <div className="step-dot">
                                  {isActive ? '✓' : (i + 1)}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`step-line ${isActive ? 'line-active' : ''}`} />
                                )}
                                <span className="step-label">{step.replace('_', ' ')}</span>
                              </div>
                          );
                        })}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}