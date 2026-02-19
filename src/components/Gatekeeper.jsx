import React from 'react';
import { useShop } from '../context/ShopContext';
import Login from '../pages/Login';

const Gatekeeper = ({ children, adminOnly = false }) => {
    const { user } = useShop();

    if (!user) {
        // Not logged in, show login on the same path
        return <Login mode="login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        // Not an admin, but trying to access admin route
        console.warn("🔐 Unauthorized access attempt to Admin Dashboard.");
        return (
            <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
                <h2 className="serif">ACCESS DENIED</h2>
                <p style={{ marginTop: '1rem', opacity: 0.6 }}>YOU DO NOT HAVE PERMISSION TO ACCESS THIS PAGE.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{ marginTop: '2rem', padding: '1rem 2rem', background: 'var(--text)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}
                >
                    RETURN HOME
                </button>
            </div>
        );
    }

    return children;
};

export default Gatekeeper;
