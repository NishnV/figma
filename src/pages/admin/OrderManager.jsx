import React, { useState } from 'react';
import { Eye, Truck } from 'lucide-react';

const OrderManager = () => {
    const [orders, setOrders] = useState([
        { id: '#MB-5421', customer: 'ANANYA SHARMA', date: 'FEB 05, 2026', total: 'RS. 4,290', status: 'Processing', payment: 'Paid' },
        { id: '#MB-5420', customer: 'RAHUL VERMA', date: 'FEB 04, 2026', total: 'RS. 5,290', status: 'Shipped', payment: 'Paid' },
        { id: '#MB-5419', customer: 'ISHA GUPTA', date: 'FEB 04, 2026', total: 'RS. 6,490', status: 'Delivered', payment: 'Paid' },
        { id: '#MB-5418', customer: 'ADITYA RAJ', date: 'FEB 03, 2026', total: 'RS. 3,290', status: 'Processing', payment: 'Unpaid' },
    ]);

    const updateStatus = (id, newStatus) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    return (
        <div className='order-manager'>
            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>CUSTOMER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAYMENT</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.total}</td>
                                <td>
                                    <span style={{ color: order.payment === 'Paid' ? '#2ecc71' : '#f39c12', fontSize: '0.65rem', fontWeight: '700' }}>
                                        {order.payment.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className={'status-select status-' + order.status.toLowerCase()}
                                        style={{ padding: '0.4rem', background: 'transparent', border: '1px solid var(--border)', fontSize: '0.7rem', color: 'inherit' }}
                                    >
                                        <option value='Processing'>PROCESSING</option>
                                        <option value='Shipped'>SHIPPED</option>
                                        <option value='Delivered'>DELIVERED</option>
                                    </select>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button title='View Details'><Eye size={18} style={{ color: 'var(--text-muted)' }} /></button>
                                        <button title='View Tracking'><Truck size={18} style={{ color: 'var(--text-muted)' }} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;
