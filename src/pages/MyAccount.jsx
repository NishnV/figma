import React from 'react';
import { useShop } from '../context/ShopContext';
import { User, ShoppingBag, Heart, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';

const MyAccount = () => {
    const { user, logout, wishlist } = useShop();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState('orders');

    if (!user) {
        return (
            <div className="account-page unauth">
                <div className="unauth-box">
                    <h1 className="serif">MY ACCOUNT</h1>
                    <p>SIGN IN TO VIEW YOUR ORDERS AND MANAGE YOUR WISHLIST.</p>
                    <div className="auth-ctas">
                        <button className="primary-btn" onClick={() => navigate('/login')}>LOG IN</button>
                        <button className="secondary-btn" onClick={() => navigate('/login', { state: { mode: 'register' } })}>REGISTER</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <header className="account-header">
                    <div className="header-labels">
                        <h1 className="serif">MY ACCOUNT</h1>
                        <p className="welcome-msg">WELCOME BACK, {user.name}</p>
                    </div>
                    <button className="logout-text-btn" onClick={handleLogout}>
                        LOGOUT
                    </button>
                </header>

                <div className="account-content-wrapper">
                    <aside className="account-sidebar">
                        <nav className="account-nav-list">
                            <button
                                className={activeTab === 'orders' ? 'active' : ''}
                                onClick={() => setActiveTab('orders')}
                            >
                                ORDER HISTORY
                            </button>
                            <button
                                className={activeTab === 'wishlist' ? 'active' : ''}
                                onClick={() => navigate('/wishlist')}
                            >
                                WISHLIST ({wishlist.length})
                            </button>
                            <button
                                className={activeTab === 'profile' ? 'active' : ''}
                                onClick={() => setActiveTab('profile')}
                            >
                                PROFILE DETAILS
                            </button>
                            <button
                                className={activeTab === 'address' ? 'active' : ''}
                                onClick={() => setActiveTab('address')}
                            >
                                ADDRESS BOOK
                            </button>
                        </nav>
                    </aside>

                    <main className="account-main">
                        {activeTab === 'orders' && (
                            <section className="account-section">
                                <h2 className="section-title">RECENT ORDERS</h2>
                                <div className="empty-order-state">
                                    <p>YOU HAVEN'T PLACED ANY ORDERS YET.</p>
                                    <button className="underline-link" onClick={() => navigate('/shop/all')}>
                                        EXPLORE THE COLLECTIONS
                                    </button>
                                </div>
                            </section>
                        )}

                        {activeTab === 'profile' && (
                            <section className="account-section">
                                <h2 className="section-title">PROFILE DETAILS</h2>
                                <div className="profile-info-grid">
                                    <div className="info-item">
                                        <label>FULL NAME</label>
                                        <p>{user.name}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>EMAIL ADDRESS</label>
                                        <p>{user.email}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>ACCOUNT TYPE</label>
                                        <p>{user.role?.toUpperCase() || 'CUSTOMER'}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {(activeTab === 'address' || activeTab === 'settings') && (
                            <section className="account-section">
                                <h2 className="section-title">{activeTab.toUpperCase()}</h2>
                                <p className="placeholder-text">NO INFORMATION SAVED YET.</p>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
