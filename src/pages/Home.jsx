import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Play, Pause } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Home.css';

const Home = () => {
    const { getAllProducts, toggleWishlist, isInWishlist, addToCart } = useShop();
    const [products, setProducts] = useState([]);
    const [upcomingProducts, setUpcomingProducts] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [selectedSizes, setSelectedSizes] = useState({});
    const [addedProduct, setAddedProduct] = useState(null);

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

    // Clear added product notification after 2 seconds
    useEffect(() => {
        if (addedProduct) {
            const timer = setTimeout(() => setAddedProduct(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [addedProduct]);

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
                                        {isPlaying ? <Pause size={16} strokeWidth={2.5} /> : <Play size={16} strokeWidth={2.5} />}
                                    </button>
                                </div>
                            </div>
                            <div className="hero-info-text-wrapper">
                                <p className="hero-info-text">
                                    crafting the future of modern minimalism. explore the essence of refined luxury. defining a new era of architectural silhouettes and timeless minimalist elegance. our collections are meticulously curated for the discerning individual, blending superior craftsmanship with a modern vision of sophistication.
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
                                <div className="product-card">
                                    <div className="product-image-wrapper">
                                        <img src={product.images?.[0] || product.img} alt={product.name} className="product-image" />
                                        <div className="product-sizes">
                                            {['XXS', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                                <button
                                                    key={size}
                                                    className={`size-btn ${selectedSizes[product.id] === size ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setSelectedSizes(prev => ({
                                                            ...prev,
                                                            [product.id]: size
                                                        }));
                                                        addToCart(product, size);
                                                        setAddedProduct({ name: product.name, size });
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Link to={`/product/${product.id}`} className="product-card-link">
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
                                                    width="24"
                                                    height="32"
                                                    viewBox="0 0 21 29"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4 25V4H17V25L10.7097 20.5319L4 25Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1"
                                                        fill={isInWishlist(product.id) ? "currentColor" : "none"}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slider-arrow next" onClick={handleNext} aria-label="Next products">
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                    {addedProduct && (
                        <div className="notification">
                            <Check size={20} color="#22c55e" strokeWidth={2.5} />
                            <span>Added {addedProduct.name} in size {addedProduct.size} to cart</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
