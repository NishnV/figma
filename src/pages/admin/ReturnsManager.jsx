import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const ReturnsManager = () => {
    const [returns, setReturns] = useState([
        { id: 'RET-001', orderId: '#MB-5421', user: 'ANANYA SHARMA', reason: 'Size too small', status: 'Pending', date: 'FEB 05, 2026' },
        { id: 'RET-002', orderId: '#MB-5410', user: 'VISHAL SINGH', reason: 'Defective product', status: 'Approved', date: 'FEB 03, 2026' },
        { id: 'RET-003', orderId: '#MB-5390', user: 'SARA KHAN', reason: 'Changed mind', status: 'Denied', date: 'JAN 30, 2026' },
    ]);

    const handleAction = (id, newStatus) => {
        setReturns(returns.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    return (
        <div className='returns-manager'>
            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>RETURN ID</th>
                            <th>ORDER</th>
                            <th>CUSTOMER</th>
                            <th>REASON</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map((ret) => (
                            <tr key={ret.id}>
                                <td>{ret.id}</td>
                                <td>{ret.orderId}</td>
                                <td>{ret.user}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={14} style={{ color: 'var(--text-muted)' }} />
                                        {ret.reason}
                                    </div>
                                </td>
                                <td>{ret.date}</td>
                                <td>
                                    <span className={'status-badge status-' + ret.status.toLowerCase()}>
                                        {ret.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {ret.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button 
                                                onClick={() => handleAction(ret.id, 'Approved')}
                                                style={{ padding: '0.5rem', background: '#2ecc71', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center' }}
                                                title='Approve'
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(ret.id, 'Denied')}
                                                style={{ padding: '0.5rem', background: '#e74c3c', color: 'white', borderRadius: '4px', border: 'none', display: 'flex', alignItems: 'center' }}
                                                title='Deny'
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReturnsManager;