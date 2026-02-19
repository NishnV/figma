import React from 'react';
import './SupportPage.css';

const Contact = () => {
    return (
        <div className="support-page">
            <div className="support-container">
                <div className="support-header">
                    <h1>CONTACT US</h1>
                    <p>WE ARE HERE TO ASSIST YOU</p>
                </div>

                <div className="support-content animate-fade">
                    <div className="grid-2">
                        <div className="support-section">
                            <h2>CUSTOMER CARE</h2>
                            <p>FOR ANY INQUIRIES REGARDING YOUR ORDER, SHIPMENT, OR OUR PRODUCTS, PLEASE REACH OUT TO US:</p>
                            <ul>
                                <li>EMAIL: CARE@MORBEI.COM</li>
                                <li>WHATSAPP: +91 98765 43210</li>
                                <li>HOURS: MON-SAT | 10:00 AM - 7:00 PM IST</li>
                            </ul>
                        </div>

                        <div className="support-section">
                            <h2>HEAD OFFICE</h2>
                            <p>MORBEI DESIGN STUDIO</p>
                            <ul>
                                <li>PIECE 42, TEXTILE DISTRICT</li>
                                <li>MUMBAI, MAHARASHTRA, 400013</li>
                                <li>INDIA</li>
                            </ul>
                        </div>
                    </div>

                    <div className="support-section" style={{ marginTop: '2rem' }}>
                        <h2>SEND US A MESSAGE</h2>
                        <form className="track-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>FULL NAME</label>
                                <input type="text" placeholder="YOUR NAME" required />
                            </div>
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" placeholder="YOUR@EMAIL.COM" required />
                            </div>
                            <div className="form-group">
                                <label>MESSAGE</label>
                                <textarea rows="5" placeholder="HOW CAN WE HELP YOU?" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">SEND MESSAGE</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
