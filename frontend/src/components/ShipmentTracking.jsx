import { useState, useEffect } from 'react';
import { getOrdersByCustomer, getShipmentByOrderId, getAllShipments,getShipmentsByUser, getOrdersByUser } from '../api/apiClient';
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

      // 1. If Admin, fetch ALL shipments globally
      if (userRole === 'ROLE_ADMIN') {
        const res = await getAllShipments();
        setShipments(res.data || []);
        setLoading(false);
        return;
      }

      // 2. If regular user, fetch user shipments (fall back to localStorage if userId prop is missing)
      const effectiveUserId = userId || localStorage.getItem('customerId');
      if (!effectiveUserId) {
        setShipments([]);
        setLoading(false);
        return;
      }

      const res = await getShipmentsByUser(effectiveUserId);
      let shipmentsData = res.data || [];


      // Fallback: If no shipment entries exist yet, map orders to default processing cards
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
              {shipments.map((shipment) => {
                const stepIdx = getStepIndex(shipment.status);
                return (
                    <div key={shipment.idShipment} className="shipment-card">
                      <div className="shipment-header">
                        <div>
                          <h3>Shipment #{shipment.idShipment}</h3>
                          <p className="shipment-order">
                            Order #{shipment.idOrder || shipment.order?.idOrder}
                            {shipment.order && (
                                <span className="shipment-total"> · ${shipment.order.totalAmount?.toFixed(2)}</span>
                            )}
                          </p>
                        </div>
                        <span className={`badge ${getStatusColor(shipment.status)}`}>
                    {shipment.status || 'Unknown'}
                  </span>
                      </div>

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