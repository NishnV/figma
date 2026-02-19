import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Home.css';

const Home = () => {
    const { getAllProducts, toggleWishlist, isInWishlist } = useShop();
    const [products, setProducts] = useState([]);
    const [upcomingProducts, setUpcomingProducts] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const heroImages = [
        '/hero-main.jpg',
        '/hero-slide-2.jpg',
        '/hero-slide-3.jpg'
    ];

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const allProducts = getAllProducts();

        // Filter upcoming
        const upcoming = allProducts.filter(p => p.category === 'UPCOMING');
        setUpcomingProducts(upcoming);

        // Filter others for main grid
        const main = allProducts.filter(p => p.category !== 'UPCOMING').slice(0, 8);
        setProducts(main);

        setCurrentIndex(main.length);
    }, [getAllProducts]);

    const handlePrev = (e) => {
        e.preventDefault();
        if (!isTransitioning) return;
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!isTransitioning) return;
        setCurrentIndex((prev) => prev + 1);
    };

    // Handle seamless loop teleportation
    useEffect(() => {
        if (products.length === 0) return;

        // When reaching the right boundary (end of 3rd set)
        if (currentIndex >= products.length * 2) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(products.length);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 800);
            return () => clearTimeout(timer);
        }

        // When reaching the left boundary (start of 1st set)
        if (currentIndex <= 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(products.length);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, products.length]);

    // Slideshow effect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isPlaying, heroImages.length]);

    return (
        <div className="home-v2">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-image-wrapper">
                    <div className="hero-slideshow">
                        {heroImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Hero ${index + 1}`}
                                className={`hero-image ${index === currentSlide ? 'active' : ''} ${index === (currentSlide - 1 + heroImages.length) % heroImages.length ? 'prev' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="hero-overlay">
                        <div className="hero-content-bottom">
                            <div className="hero-main-actions">
                                <Link to="/shop/all" className="hero-cta">
                                    <span className="hero-cta-text">SHOP</span>
                                </Link>
                                <div className="hero-controls">
                                    <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="hero-info-text-wrapper">
                                <p className="hero-info-text">
                                    CRAFTING THE FUTURE OF MODERN MINIMALISM. EXPLORE THE ESSENCE OF REFINED LUXURY. DEFINING A NEW ERA OF ARCHITECTURAL SILHOUETTES AND TIMELESS MINIMALIST ELEGANCE. OUR COLLECTIONS ARE METICULOUSLY CURATED FOR THE DISCERNING INDIVIDUAL, BLENDING SUPERIOR CRAFTSMANSHIP WITH A MODERN VISION OF SOPHISTICATION.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* UPCOMING SECTION */}
            {upcomingProducts.length > 0 && (
                <section className="upcoming-section reveal reveal-up">
                    <div className="upcoming-header">
                        <span className="upcoming-label">NEXT DROP</span>
                        <h2 className="upcoming-title">UPCOMING COLLECTIONS</h2>
                    </div>
                    <div className="upcoming-grid">
                        {upcomingProducts.map((product) => (
                            <div key={product.id} className="upcoming-item">
                                <div className="upcoming-img-wrapper">
                                    <img src={product.images?.[0] || product.img} alt={product.name} />
                                    <div className="upcoming-badge">COMING SOON</div>
                                </div>
                                <h3 className="upcoming-name">{product.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Campaign Section */}
            <section className="campaign-section">
                <div className="campaign-split">
                    <div className="campaign-half reveal reveal-right">
                        <img src="/campaign-1.jpg" alt="Campaign Left" />
                    </div>
                    <div className="campaign-half reveal reveal-left">
                        <img src="/split-right.jpg" alt="Campaign Right" />
                    </div>
                </div>
                <div className="campaign-overlay reveal reveal-up">
                    <h2 className="campaign-title">S/S '26</h2>
                    <Link to="/shop/new-in" className="campaign-link">EXPLORE</Link>
                </div>
            </section>

            {/* Main Product Slider */}
            <section className="product-grid-section">
                <div className="product-grid-header">
                    <h2 className="grid-title">ESSENTIAL PIECES</h2>
                </div>
                <div className="product-slider-container">
                    <button className="slider-arrow prev" onClick={handlePrev} aria-label="Previous products">
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <div
                        className="product-grid"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / (viewportWidth < 768 ? 1 : viewportWidth < 1024 ? 2 : 4))}%)`,
                            transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)' : 'none'
                        }}
                    >
                        {[...products, ...products, ...products].map((product, index) => (
                            <div key={`${product.id}-${index}`} className="product-card-wrapper reveal reveal-up">
                                <Link to={`/product/${product.id}`} className="product-card">
                                    <div className="product-image-wrapper">
                                        <img src={product.images?.[0] || product.img} alt={product.name} className="product-image" />
                                        <div className="product-sizes">
                                            <span>S</span><span>M</span><span>L</span>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <div className="product-text">
                                            <h3 className="product-name">{product.name}</h3>
                                            <p className="product-price">{product.price}</p>
                                        </div>
                                        <button
                                            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(product);
                                            }}
                                        >
                                            <svg
                                                width="16"
                                                height="24"
                                                viewBox="0 0 24 40"
                                                fill={isInWishlist(product.id) ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinejoin="miter"
                                                strokeLinecap="square"
                                            >
                                                <path d="M 6 4 H 18 V 36 L 12 30 L 6 36 V 4 Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button className="slider-arrow next" onClick={handleNext} aria-label="Next products">
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
