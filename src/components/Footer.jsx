import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-v2">
            <div className="container">
                <div className="footer-top-v2">
                    <div className="footer-member">
                        <h3>BE A MEMBER, <br /> GET PRE LAUNCH ACCESS</h3>
                        <form className="signup-form">
                            <input type="email" placeholder="EMAIL" />
                            <button type="submit">SIGN UP</button>
                        </form>
                    </div>

                    <div className="footer-links-v2">
                        <div className="link-group">
                            <h4>QUICK LINKS</h4>
                            <ul>
                                <li><Link to="/">HOME</Link></li>
                                <li><Link to="/about">ABOUT</Link></li>
                                <li><Link to="/contact">CONTACT US</Link></li>
                                <li><Link to="/shop/new-in">NEW IN</Link></li>
                            </ul>
                        </div>
                        <div className="link-group">
                            <h4>HELP/SUPPORT</h4>
                            <ul>
                                <li><Link to="/faqs">FAQS</Link></li>
                                <li><Link to="/track">TRACK ORDER</Link></li>
                                <li><Link to="/shipping">SHIPPING</Link></li>
                                <li><Link to="/returns">RETURNS & EXCHANGES</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-v2">
                    <div className="legal-links">
                        <Link to="/privacy">PRIVACY POLICY</Link>
                        <Link to="/terms">TERMS & CONDITIONS</Link>
                        <Link to="/cookies">COOKIE POLICY</Link>
                    </div>
                    <div className="copyright">
                        © 2026 MORBEI. ALL RIGHTS RESERVED.
                    </div>
                    <div className="social">
                        <a href="#" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
