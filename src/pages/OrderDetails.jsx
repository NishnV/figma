import React from 'react';
import { useShop } from '../context/ShopContext';
import './Checkout.css'; // Reuse checkout styles for tracker

const OrderDetails = () => {
    const { cart } = useShop();

    // Mock order date and items if cart is empty for demo
    const displayItems = cart.length > 0 ? cart : [
        { id: 'hillary-blazer', name: 'HILLARY BLAZER', price: 'RS. 6470', priceNum: 6470, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600', size: 'XXS', quantity: 1, color: 'BEIGE' },
        { id: 'tasha-trousers', name: 'TASHA TROUSERS', price: 'RS. 5290', priceNum: 5290, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600', size: 'XXS', quantity: 1, color: 'GREY' }
    ];

    return (
        <div className="order-details-page">
            <div className="order-details-container">
                <h1 className="order-details-header reveal reveal-up">ORDER DETAILS</h1>

                <div className="order-items-list-v3">
                    {displayItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="order-item-block reveal reveal-up">
                            <div className="order-item-left">
                                <div className="order-item-main-info">
                                    <img src={item.img} alt={item.name} className="order-item-img" />
                                    <div className="order-item-texts">
                                        <h3 className="order-item-name">{item.name}</h3>
                                        <span className="order-item-sub">{item.color || 'BLACK'} &nbsp; {item.size}</span>
                                        <span className="order-item-sub">QTY {item.quantity}</span>
                                        <span className="order-item-sub">{item.price}</span>
                                    </div>
                                </div>
                                <button className="cancel-order-btn">CANCEL</button>
                            </div>

                            <div className="order-item-shipping-info">
                                <div className="address-details">
                                    <strong>HARINI MANOKARAN</strong>
                                    <p>5/7 NARASIMAN STREET, WEST MAMBALAM, CHENNAI 600033, TAMIL NADU, INDIA.</p>
                                    <p>+91 9897053333</p>
                                    <p>HARINIMANO24@GMAIL.COM</p>
                                </div>
                            </div>

                            <div className="order-progress-block">
                                <div className="order-tracker-v3">
                                    {[
                                        { label: 'ORDER PLACED', active: true },
                                        { label: 'PACKED', active: false },
                                        { label: 'SHIPPED', active: false },
                                        { label: 'OUT FOR DELIVERY', active: false },
                                        { label: 'DELIVERED', active: false }
                                    ].map((step, sIdx) => (
                                        <div key={step.label} className="tracker-node">
                                            <div className={`tracker-dot ${step.active ? 'active' : ''}`}></div>
                                            <span className={`tracker-label ${step.active ? 'active' : ''}`}>{step.label}</span>
                                            <div className="tracker-line"></div>
                                        </div>
                                    ))}
                                </div>
                                <span className="est-delivery-badge">ESTIMATED DELIVERY FEB 14-18</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
