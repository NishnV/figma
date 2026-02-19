import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Heart, Menu, X, Trash2, Bookmark, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { cart, wishlist, toggleWishlist, removeFromCart, updateQuantity, user, logout, getAllProducts } = useShop();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (query.trim()) {
            setIsSearching(true);
            setSuggestions([]);

            searchTimeout.current = setTimeout(() => {
                const allProducts = getAllProducts();
                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
                setIsSearching(false);
            }, 3000);
        } else {
            setSuggestions([]);
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsSearchOpen(false);
            setSearchQuery('');
            setSuggestions([]);
            navigate(`/shop/all?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-left">
                    <button
                        className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        <div className="hamburger-icon" aria-hidden="true">
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="MORBEI" className="logo-img" />
                    </Link>

                </div>

                <div className="nav-right">
                    <div className={`nav-search-container ${isSearchOpen ? 'active' : ''}`}>
                        <button className="search-label" onClick={() => setIsSearchOpen(true)}>
                            <span className="nav-text-btn">SEARCH</span>
                        </button>
                        <div className="nav-search-bar">
                            <input
                                type="text"
                                placeholder="SEARCH FOR PRODUCTS..."
                                className="nav-search-input"
                                value={searchQuery}
                                onChange={handleSearchInput}
                                onKeyDown={handleSearchSubmit}
                                autoFocus={isSearchOpen}
                            />
                            {isSearching && <Loader2 size={16} className="search-loader animate-spin" />}
                            <button className="search-close-inline" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}>
                                <X size={18} />
                            </button>
                        </div>
                        {suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map(p => (
                                    <Link key={p.id} to={`/product/${p.id}`} className="suggestion-item" onClick={() => setIsSearchOpen(false)}>
                                        <div className="suggestion-img">
                                            <img src={p.images?.[0] || p.img} alt={p.name} />
                                        </div>
                                        <div className="suggestion-info">
                                            <span className="suggestion-name">{p.name}</span>
                                            <span className="suggestion-price">{p.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="nav-icons">
                        {user ? (
                            user.role === 'admin' ? (
                                <Link to="/admin" className="nav-text-btn">ADMIN</Link>
                            ) : (
                                <Link to="/account" className="nav-text-btn">MY ACCOUNT</Link>
                            )
                        ) : (
                            <Link to="/login" className="nav-text-btn">LOGIN</Link>
                        )}
                        <Link to="/wishlist" className="nav-text-btn">
                            WISHLIST {wishlist.length > 0 && `[${wishlist.length}]`}
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="nav-text-btn">
                            SHOPPING BAG [{cartCount}]
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Overlay */}
            <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="menu-container">

                    <ul className="menu-links">
                        <li><Link to="/shop/all" onClick={() => setIsMenuOpen(false)}>ALL PRODUCTS</Link></li>
                        <li><Link to="/shop/tops" onClick={() => setIsMenuOpen(false)}>TOPS</Link></li>
                        <li><Link to="/shop/dresses" onClick={() => setIsMenuOpen(false)}>DRESSES</Link></li>
                        <li><Link to="/shop/new-in" onClick={() => setIsMenuOpen(false)}>NEW IN</Link></li>
                        <li><Link to="/shop/bottoms" onClick={() => setIsMenuOpen(false)}>BOTTOMS</Link></li>
                        <li><Link to="/editorials" onClick={() => setIsMenuOpen(false)}>EDITORIAL</Link></li>
                    </ul>
                </div>
            </div>

            {/* Cart Panel Backdrop & Panel */}
            <div
                className={`cart-panel-backdrop ${isCartOpen ? 'visible' : ''}`}
                onClick={() => setIsCartOpen(false)}
                onKeyDown={(e) => e.key === 'Escape' && setIsCartOpen(false)}
                role="button"
                tabIndex={0}
                aria-label="Close cart"
            />
            <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-panel-header">
                    <h3>SHOPPING BAG ({cartCount})</h3>
                    <button type="button" className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
                <div className="cart-panel-content">
                    {cart.length === 0 ? (
                        <p className="empty-cart-msg">YOUR BAG IS EMPTY</p>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map(item => (
                                <div key={`${item.id}-${item.size}`} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p>SIZE: {item.size}</p>
                                        <p>PRICE: {typeof item.price === 'number' ? `RS. ${item.price}` : item.price}</p>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.size, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, 1)}>+</button>
                                        </div>
                                    </div>
                                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id, item.size)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="cart-panel-footer">
                        <Link to="/cart" className="checkout-btn" onClick={() => setIsCartOpen(false)}>VIEW SHOPPING BAG</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
