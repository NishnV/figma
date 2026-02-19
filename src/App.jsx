import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/ScrollToTop';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Gatekeeper from './components/Gatekeeper';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Editorials from './pages/Editorials';
import About from './pages/About';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import MyAccount from './pages/MyAccount';
import Wishlist from './pages/Wishlist';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import ReturnsManager from './pages/admin/ReturnsManager';
import OrderDetails from './pages/OrderDetails';

const ShopWrapper = () => {
  const { category } = useParams();
  return <Shop category={category?.toUpperCase()} />;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal:not(.active)');
      newElements.forEach(el => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app">
      {!isAdminPath && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:category" element={<ShopWrapper />} />
          <Route path="/shop" element={<ShopWrapper />} />
          <Route path="/editorials" element={<Editorials />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login mode="login" />} />
          <Route path="/register" element={<Login mode="register" />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:step" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/order-confirmed" element={<OrderDetails />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/account" element={<MyAccount />} />

          <Route path="/admin" element={<Gatekeeper adminOnly={true}><AdminLayout /></Gatekeeper>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="returns" element={<ReturnsManager />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ShopProvider>
  );
}

export default App;
