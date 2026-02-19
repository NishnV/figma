import React, { useState } from 'react';
import { User, Edit2, Shield, Trash2 } from 'lucide-react';

const UserManager = () => {
    const [users, setUsers] = useState([
        { id: '1', name: 'ANANYA SHARMA', email: 'ananya@example.com', role: 'Customer', joined: 'JAN 12, 2026', status: 'Active' },
        { id: '2', name: 'RAHUL VERMA', email: 'rahul@example.com', role: 'Customer', joined: 'JAN 15, 2026', status: 'Active' },
        { id: '3', name: 'ADMIN USER', email: 'admin@morbei.com', role: 'Admin', joined: 'JAN 01, 2026', status: 'Active' },
        { id: '4', name: 'ISHA GUPTA', email: 'isha@example.com', role: 'Customer', joined: 'FEB 02, 2026', status: 'Suspended' },
    ]);

    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
        ));
    };

    return (
        <div className='user-manager'>
            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>EMAIL</th>
                            <th>ROLE</th>
                            <th>JOINED</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'var(--bg-offset)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} />
                                        </div>
                                        <span>{user.name}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: user.role === 'Admin' ? '#3498db' : 'inherit' }}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>{user.joined}</td>
                                <td>
                                    <span className={'status-badge status-' + user.status.toLowerCase()}>
                                        {user.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button title='Edit User'><Edit2 size={16} style={{ color: 'var(--text-muted)' }} /></button>
                                        <button title='Manage Permissions'><Shield size={16} style={{ color: 'var(--text-muted)' }} /></button>
                                        <button
                                            title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            onClick={() => toggleStatus(user.id)}
                                        >
                                            <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
                                        </button>
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

export default UserManager;
