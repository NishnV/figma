import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Bookmark } from 'lucide-react';
import './Cart.css';

const getItemPrice = (item) => {
    if (typeof item.price === 'number') return item.price;
    if (item.priceNum != null) return item.priceNum;
    return parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
};

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, toggleWishlist, getAllProducts } = useShop();

    const subtotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
    const tax = 30; // Mock tax
    const total = subtotal + tax;

    // Get recommendations - filter out cart items and get 4 random products
    const recommendations = useMemo(() => {
        const allProducts = getAllProducts();
        const cartIds = cart.map(item => item.id);
        const availableProducts = allProducts.filter(p => !cartIds.includes(p.id));
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [cart, getAllProducts]);

    if (cart.length === 0) {
        return (
            <div className="cart-page-dark">
                <div className="cart-container-main full-width">
                    <div className="cart-empty-state">
                        <h1 className="cart-title reveal reveal-up">YOUR SHOPPING BAG IS EMPTY</h1>
                        <Link to="/shop/all" className="shop-all-link reveal reveal-up reveal-delay-2">CONTINUE SHOPPING</Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleMoveToWishlist = (item) => {
        toggleWishlist(item);
        removeFromCart(item.id, item.size);
    };

    return (
        <div className="cart-page-dark">
            <div className="cart-container-main">
                <div className="cart-left-section">
                    <h1 className="cart-title reveal reveal-up">SHOPPING BAG</h1>

                    <div className="cart-table-v2">
                        <div className="cart-header-v2">
                            <span>ITEM</span>
                            <span>COLOUR | SIZE</span>
                            <span>QUANTITY</span>
                            <span>PRICE</span>
                        </div>

                        {cart.map((item, index) => (
                            <div className={`cart-row-v2 reveal reveal-up reveal-delay-${(index % 4) + 1}`} key={`${item.id}-${item.size}`}>
                                <div className="item-cell">
                                    <div className="item-thumb">
                                        <Link to={`/product/${item.id}`}>
                                            <img src={item.img} alt={item.name} />
                                        </Link>
                                    </div>
                                    <span className="item-name">{item.name}</span>
                                </div>
                                <div className="details-cell">BEIGE | {item.size}</div>
                                <div className="quantity-cell">
                                    <div className="q-stepper">
                                        <button onClick={() => updateQuantity(item.id, item.size, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, 1)}>+</button>
                                    </div>
                                </div>
                                <div className="price-cell">
                                    <div className="price-info">
                                        <span className="current-price">RS. {getItemPrice(item) * item.quantity}</span>
                                    </div>
                                    <button
                                        className="move-to-wishlist-link"
                                        onClick={() => handleMoveToWishlist(item)}
                                    >
                                        Move to<br />wishlist
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="continue-shopping-wrapper">
                        <Link to="/shop/all" className="continue-shopping">—— Continue shopping</Link>
                    </div>

                    {/* Recommendations Section - Kept in Left Column */}
                    <div className="pd-recommendations reveal reveal-up">
                        <h3 className="rec-title">YOU MIGHT BE INTERESTED IN</h3>
                        <div className="rec-grid">
                            {recommendations.map((prod, index) => (
                                <div className={`rec-product reveal reveal-up reveal-delay-${index + 1}`} key={prod.id}>
                                    <Link to={`/product/${prod.id}`}>
                                        <img src={prod.images?.[0] || prod.img} alt={prod.name} />
                                    </Link>
                                    <div className="rec-details-row">
                                        <Link to={`/product/${prod.id}`} className="rec-info-text">
                                            <span className="rec-name">{prod.name}</span>
                                            <span className="rec-price">{prod.price}</span>
                                        </Link>
                                        <Bookmark size={20} strokeWidth={1} className="rec-bookmark" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cart-summary-section reveal reveal-left">
                    <h2 className="summary-title">SUMMARY</h2>
                    <div className="summary-content">
                        <div className="summary-row">
                            <span>SUBTOTAL</span>
                            <span>RS. {subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>SHIPPING (Standard)</span>
                            <span>FREE</span>
                        </div>
                        <div className="summary-row">
                            <span>TAX</span>
                            <span>RS. {tax}</span>
                        </div>
                    </div>
                    <div className="summary-total">
                        <span>TOTAL</span>
                        <span>RS. {total}</span>
                    </div>
                    <Link to="/checkout" className="checkout-btn-v2">CHECKOUT</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
