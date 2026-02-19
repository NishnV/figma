import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import './TrackOrder.css';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        // Simulated tracking logic
        if (orderId) {
            setOrderStatus({
                id: orderId.toUpperCase(),
                status: 'IN TRANSIT',
                estimatedDelivery: 'FEB 18, 2026',
                steps: [
                    { label: 'ORDER PLACED', date: 'FEB 12', completed: true },
                    { label: 'PROCESSING', date: 'FEB 13', completed: true },
                    { label: 'SHIPPED', date: 'FEB 14', completed: true },
                    { label: 'IN TRANSIT', date: 'FEB 15', completed: false },
                    { label: 'DELIVERED', date: '--', completed: false }
                ]
            });
        }
    };

    return (
        <div className="track-order-page">
            <div className="track-container">
                <h1 className="serif">TRACK YOUR ORDER</h1>
                <p className="track-desc">ENTER YOUR ORDER NUMBER TO SEE THE CURRENT STATUS AND ESTIMATED DELIVERY DATE.</p>

                <form className="track-form" onSubmit={handleTrack}>
                    <div className="search-input-wrapper">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="ORDER NUMBER (e.g. MB-5421)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="track-btn">TRACK STATUS</button>
                </form>

                {orderStatus && (
                    <div className="tracking-results reveal active">
                        <div className="status-header">
                            <div>
                                <span className="order-label">ORDER ID: {orderStatus.id}</span>
                                <h2 className="current-status">{orderStatus.status}</h2>
                            </div>
                            <div className="est-delivery">
                                <span className="order-label">ESTIMATED DELIVERY</span>
                                <h3>{orderStatus.estimatedDelivery}</h3>
                            </div>
                        </div>

                        <div className="tracking-timeline">
                            {orderStatus.steps.map((step, index) => (
                                <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                                    <div className="step-marker">
                                        {step.completed ? <CheckCircle size={24} /> : (index === 3 ? <Truck size={24} /> : <Package size={24} />)}
                                    </div>
                                    <div className="step-info">
                                        <span className="step-label">{step.label}</span>
                                        <span className="step-date">{step.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
