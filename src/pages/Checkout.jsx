import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Bookmark } from 'lucide-react';
import './Checkout.css';

const getItemPrice = (item) => {
    if (typeof item.price === 'number') return item.price;
    if (item.priceNum != null) return item.priceNum;
    return parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
};

const Checkout = () => {
    const { step: urlStep } = useParams();
    const [currentStep, setCurrentStep] = useState(urlStep || 'information');
    const { cart, updateQuantity, toggleWishlist, removeFromCart, getAllProducts } = useShop();
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum, item) => {
        return sum + (getItemPrice(item) * item.quantity);
    }, 0);
    const tax = 30; // Mock tax
    const total = subtotal + tax;

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Get recommendations - filter out cart items and get 4 random products
    const recommendations = useMemo(() => {
        const allProducts = getAllProducts();
        const cartIds = cart.map(item => item.id);
        const availableProducts = allProducts.filter(p => !cartIds.includes(p.id));
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [cart, getAllProducts]);

    useEffect(() => {
        if (urlStep && urlStep !== currentStep) {
            setCurrentStep(urlStep);
        }
    }, [urlStep]);

    const handleNext = (next) => {
        setCurrentStep(next);
        navigate(`/checkout/${next}`);
    };

    const renderHeader = () => {
        let title = "CHECKOUT";
        if (currentStep === 'delivery') title = "ESTIMATED DELIVERY";
        if (currentStep === 'payment') title = "PAYMENT";

        return (
            <div className="checkout-top-header">
                <h1 className="reveal reveal-up">{title}</h1>
                <div className="checkout-total-info reveal reveal-up reveal-delay-2">
                    {currentStep === 'delivery' ? (
                        <>
                            <span className="total-value-v3">FEB 14 - FEB 20 &nbsp; [STANDARD]</span>
                            <span className="item-count-v3">{cartCount} ITEMS</span>
                        </>
                    ) : (
                        <span className="total-value-v3">TOTAL RS. {subtotal}</span>
                    )}
                </div>
            </div>
        );
    };

    const renderProgress = () => {
        const steps = [
            { id: 'information', label: 'INFORMATION' },
            { id: 'delivery', label: 'DELIVERY' },
            { id: 'payment', label: 'PAYMENT' }
        ];

        return (
            <div className="checkout-progress-v3 reveal reveal-left">
                <div className="progress-line"></div>
                <div className="progress-steps-v3">
                    {steps.map((s, idx) => (
                        <div key={s.id} className="progress-step-item">
                            <div className={`step-box ${currentStep === s.id ? 'active' : ''}`}></div>
                            <span className={`step-label ${currentStep === s.id ? 'active' : ''}`}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleMoveToWishlist = (item) => {
        toggleWishlist(item);
        removeFromCart(item.id, item.size);
    };

    return (
        <div className="checkout-page-v3">
            <div className="checkout-container-v3">
                {/* Shopping Bag Section (Top) */}
                <div className="shopping-bag-section">
                    <div className="bag-left-section">
                        <h1 className="bag-title">SHOPPING BAG</h1>
                        
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
                            <Link to="/shop/all" className="continue-shopping">
                                <svg width="36" height="4" viewBox="0 0 36 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.0732231 1.66423C-0.0244064 1.76186 -0.0244064 1.92015 0.0732231 2.01778L1.66422 3.60877C1.76185 3.7064 1.92014 3.7064 2.01777 3.60877C2.1154 3.51113 2.1154 3.35284 2.01777 3.25521L0.603554 1.841L2.01776 0.426785C2.11539 0.329154 2.11539 0.170863 2.01776 0.0732318C1.92013 -0.0243991 1.76184 -0.0243986 1.66421 0.0732327L0.0732231 1.66423ZM35.25 1.84091L35.25 1.59091L0.25 1.591L0.25 1.841L0.25 2.091L35.25 2.09091L35.25 1.84091Z" fill="white"/>
                                </svg>
                                Continue shopping
                            </Link>
                        </div>

                        {/* Recommendations Section */}
                        <div className="pd-recommendations reveal reveal-up">
                            <h3 className="rec-title">YOU MIGHT BE INTERESTED IN</h3>
                            <div className="rec-grid">
                                {recommendations.map((prod, index) => (
                                    <div className={`rec-product reveal reveal-up reveal-delay-${index + 1}`} key={prod.id}>
                                        <Link to={`/product/${prod.id}`} className="rec-image-wrapper">
                                            <img src={prod.images?.[0] || prod.img} alt={prod.name} />
                                            <div className="product-sizes">
                                                {['XXS', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                                    <span key={size}>{size}</span>
                                                ))}
                                            </div>
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

                    <div className="bag-summary-section">
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
                        <button className="checkout-btn-summary" onClick={() => handleNext('information')}>CHECKOUT</button>
                    </div>
                </div>

                {/* Checkout Form Section (Below) */}
                <div className="checkout-form-section">
                    <h2 className="form-section-title">CHECKOUT</h2>
                    
                    <div className="checkout-layout-v3">
                        {renderProgress()}

                        <div className="checkout-content-v3">
                        {currentStep === 'information' && (
                            <div className="checkout-step-content reveal reveal-up">
                                <div className="checkout-section-v3">
                                    <div className="section-title-v3">
                                        <h2>PERSONAL INFORMATION</h2>
                                        <div className="login-hint">Already have an account? <span>Login</span></div>
                                    </div>
                                    <div className="checkout-form-v3">
                                        <div className="form-row-v3">
                                            <input type="text" placeholder="FIRST NAME" className="checkout-input-v3" />
                                            <input type="text" placeholder="LAST NAME" className="checkout-input-v3" />
                                        </div>
                                        <input type="text" placeholder="MOBILE NUMBER" className="checkout-input-v3" />
                                        <input type="email" placeholder="EMAIL" className="checkout-input-v3" />
                                    </div>
                                </div>

                                <div className="checkout-section-v3">
                                    <div className="section-title-v3">
                                        <h2>SHIPPING INFORMATION</h2>
                                    </div>
                                    <div className="checkout-form-v3">
                                        <input type="text" placeholder="COUNTRY/ REGION" className="checkout-input-v3" />
                                        <input type="text" placeholder="STATE" className="checkout-input-v3" />
                                        <input type="text" placeholder="ADDRESS" className="checkout-input-v3" />
                                        <input type="text" placeholder="PIN/ ZIP CODE" className="checkout-input-v3" />
                                    </div>
                                </div>

                                <div className="checkout-actions-v3">
                                    <Link to="/cart" className="go-back-link">Go to shopping bag</Link>
                                    <button className="checkout-next-btn" onClick={() => handleNext('delivery')}>CONTINUE</button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'delivery' && (
                            <div className="checkout-step-content reveal reveal-up">
                                <div className="delivery-info-display">
                                    <div className="delivery-info-header">
                                        <span>DELIVER TO</span>
                                        <button className="edit-btn">EDIT</button>
                                    </div>
                                    <div className="address-details">
                                        <strong>HARINI MANOKARAN</strong>
                                        <p>5/7 NARASIMAN STREET, WEST MAMBALAM, CHENNAI 600033, TAMIL NADU, INDIA.</p>
                                        <p>+91 9897053333</p>
                                        <p>HARINIMANO24@GMAIL.COM</p>
                                    </div>
                                </div>

                                <div className="checkout-section-v3">
                                    <div className="section-title-v3">
                                        <h2>SELECT DELIVERY</h2>
                                    </div>
                                    <div className="delivery-options-v3">
                                        <div className="delivery-option-item">
                                            <div className="delivery-option-left">
                                                <div className="option-radio selected"></div>
                                                <div className="option-text">
                                                    <span className="option-name">STANDARD</span>
                                                    <span className="option-desc">delivery within 7-10 days</span>
                                                </div>
                                            </div>
                                            <span className="option-price">FREE</span>
                                        </div>
                                        <div className="delivery-option-item">
                                            <div className="delivery-option-left">
                                                <div className="option-radio"></div>
                                                <div className="option-text">
                                                    <span className="option-name">PRIORITY</span>
                                                    <span className="option-desc">delivery within 3-5 days</span>
                                                </div>
                                            </div>
                                            <span className="option-price">RS. 200</span>
                                        </div>
                                    </div>
                                    <p className="delivery-footnote">*free standard delivery for all orders above Rs. 6790</p>
                                </div>

                                <div className="checkout-actions-v3">
                                    <button className="go-back-link" onClick={() => handleNext('information')}>Go back</button>
                                    <button className="checkout-next-btn" onClick={() => handleNext('payment')}>CONTINUE</button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'payment' && (
                            <div className="checkout-step-content reveal reveal-up">
                                <div className="checkout-section-v3">
                                    <div className="section-title-v3">
                                        <h2>SELECT PAYMENT</h2>
                                    </div>
                                    <div className="payment-selection-v3">
                                        <div className="payment-method-group">
                                            <div className="payment-option-header">
                                                <div className="option-radio selected"></div>
                                                <span>CREDIT/DEBIT CARD</span>
                                            </div>
                                            <div className="payment-card-form">
                                                <div className="form-row-v3">
                                                    <input type="text" placeholder="CARD NUMBER" className="checkout-input-v3" />
                                                    <input type="text" placeholder="CARDHOLDER NAME" className="checkout-input-v3" />
                                                </div>
                                                <div className="form-row-v3">
                                                    <input type="text" placeholder="EXPIRATION DATE ( MM/YY )" className="checkout-input-v3" />
                                                    <input type="text" placeholder="CVV" className="checkout-input-v3" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="payment-option-header">
                                            <div className="option-radio"></div>
                                            <span>NET BANKING</span>
                                        </div>

                                        <div className="payment-option-header">
                                            <div className="option-radio"></div>
                                            <span>UPI</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="checkout-actions-v3">
                                    <button className="go-back-link" onClick={() => handleNext('delivery')}>Go back</button>
                                    <button className="checkout-next-btn" onClick={() => navigate('/order-details')}>PAY & PURCHASE</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

