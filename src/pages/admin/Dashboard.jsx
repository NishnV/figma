import React from 'react';
import { DollarSign, Users, Package, ShoppingBag, ArrowUpRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'TOTAL REVENUE', value: 'RS. 1,24,590', icon: <DollarSign size={20} />, trend: '+12.5%' },
        { label: 'TOTAL ORDERS', value: '1,240', icon: <Package size={20} />, trend: '+8.2%' },
        { label: 'TOTAL USERS', value: '856', icon: <Users size={20} />, trend: '+15.1%' },
        { label: 'PRODUCTS', value: '42', icon: <ShoppingBag size={20} />, trend: '0%' },
    ];

    const recentOrders = [
        { id: '#MB-5421', user: 'ANANYA SHARMA', amount: 'RS. 4,290', status: 'Processing' },
        { id: '#MB-5420', user: 'RAHUL VERMA', amount: 'RS. 5,290', status: 'Shipped' },
        { id: '#MB-5419', user: 'ISHA GUPTA', amount: 'RS. 6,490', status: 'Delivered' },
        { id: '#MB-5418', user: 'ADITYA RAJ', amount: 'RS. 3,290', status: 'Processing' },
    ];

    return (
        <div className='admin-dashboard'>
            <div className='grid-4' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className='admin-card stats-card'>
                        <div className='stats-header' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span className='stats-label' style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                            <div className='stats-icon'>{stat.icon}</div>
                        </div>
                        <div className='stats-body'>
                            <h2 className='stats-value' style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{stat.value}</h2>
                            <span className='stats-trend' style={{ fontSize: '0.7rem', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <ArrowUpRight size={14} /> {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='dashboard-grid' style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div className='admin-card'>
                    <div className='card-header' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.85rem' }}>RECENT ORDERS</h3>
                        <button className='view-all-btn' style={{ fontSize: '0.65rem', textDecoration: 'underline' }}>VIEW ALL</button>
                    </div>
                    <table className='admin-table'>
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>CUSTOMER</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user}</td>
                                    <td>{order.amount}</td>
                                    <td>
                                        <span className={'status-badge status-' + order.status.toLowerCase()}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='admin-card'>
                    <h3 style={{ fontSize: '0.85rem' }}>SALES OVERVIEW</h3>
                    <div className='chart-placeholder' style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-offset)', marginTop: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <TrendingUp size={48} opacity={0.2} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem' }}>SALES ANALYTICS CHART</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
