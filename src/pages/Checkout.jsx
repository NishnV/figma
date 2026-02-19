import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Checkout.css';

const Checkout = () => {
    const { step: urlStep } = useParams();
    const [currentStep, setCurrentStep] = useState(urlStep || 'information');
    const { cart } = useShop();
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum, item) => {
        // Handle RS. price string
        const p = typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : (item.priceNum || 0);
        return sum + (p * item.quantity);
    }, 0);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

    return (
        <div className="checkout-page-v3">
            <div className="checkout-container-v3">
                {renderHeader()}

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
    );
};

export default Checkout;

