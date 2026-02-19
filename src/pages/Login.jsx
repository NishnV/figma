import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Login.css';

const Login = ({ mode = 'login' }) => {
    const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const { login } = useShop();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Admin Credentials
        const isAdmin = formData.email === 'admin@morbei.com' && formData.password === 'admin123';

        const userData = {
            id: Date.now(),
            name: isAdmin ? 'ADMIN' : (formData.name || formData.email.split('@')[0].toUpperCase()),
            email: formData.email,
            role: isAdmin ? 'admin' : 'user'
        };

        login(userData);

        if (isAdmin) {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-page-v2">
            <div className="login-split">
                <div className="login-image-side reveal">
                    <div className="image-wrapper">
                        <img src="/login-side.jpg" alt="Morbei Fashion" />
                    </div>
                </div>
                <div className="login-form-side reveal">
                    <div className="form-content">
                        <h1 className="form-title">{isLoginMode ? 'SIGN IN' : 'CREATE YOUR ACCOUNT'}</h1>

                        <form className="m-login-form" onSubmit={handleSubmit}>
                            {!isLoginMode && (
                                <div className="m-form-group">
                                    <label className="m-input-label">YOUR NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="m-form-group">
                                <label className="m-input-label">EMAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="m-form-group">
                                <label className="m-input-label">PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {!isLoginMode && (
                                <>
                                    <div className="m-form-group">
                                        <label className="m-input-label">+91 <span>∨</span> MOBILE</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="m-form-checkbox">
                                        <input type="checkbox" id="notify" />
                                        <label htmlFor="notify">I would like to be notified on new releases</label>
                                    </div>
                                </>
                            )}

                            <div className="button-group">
                                <button type="submit" className="m-submit-btn">
                                    {isLoginMode ? 'SIGN IN' : 'CREATE ACCOUNT'}
                                </button>

                                <button type="button" className="google-btn">
                                    <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="G" className="google-icon" />
                                    SIGN IN WITH GOOGLE
                                </button>
                            </div>
                        </form>

                        <div className="login-switch">
                            <span>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</span>
                            <button
                                className="switch-btn"
                                onClick={() => setIsLoginMode(!isLoginMode)}
                            >
                                {isLoginMode ? ' Register' : ' Login'}
                            </button>
                        </div>

                        <div className="legal-footer">
                            <p>By signing in or creating an account, you agree to our <strong>Privacy Policy</strong> and <strong>Terms & Conditions</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
