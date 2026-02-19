import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Package, RefreshCw, LogOut } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useShop();

    const menuItems = [
        { path: '/admin', name: 'DASHBOARD', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/products', name: 'PRODUCTS', icon: <ShoppingBag size={20} /> },
        { path: '/admin/orders', name: 'ORDERS', icon: <Package size={20} /> },
        { path: '/admin/users', name: 'USERS', icon: <Users size={20} /> },
        { path: '/admin/returns', name: 'RETURNS', icon: <RefreshCw size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='admin-layout'>
            <aside className='admin-sidebar'>
                <div className='admin-logo'>
                    <img src="/logo.png" alt="MORBEI" className="admin-logo-img" />
                    <span>ADMIN PANEL</span>
                </div>

                <nav className='admin-nav'>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={'admin-nav-item ' + (location.pathname === item.path ? 'active' : '')}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className='sidebar-footer'>
                    <button onClick={handleLogout} className='exit-btn'>
                        <LogOut size={20} />
                        <span>LOGOUT</span>
                    </button>
                    <Link to='/' className='exit-btn'>
                        <RefreshCw size={20} />
                        <span>VIEW SITE</span>
                    </Link>
                </div>
            </aside>

            <main className='admin-content'>
                <header className='admin-header'>
                    <h1>{menuItems.find(i => i.path === location.pathname)?.name || 'ADMIN'}</h1>
                    <div className='admin-user-info'>
                        <span>ADMINISTRATOR</span>
                    </div>
                </header>
                <div className='admin-body'>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;