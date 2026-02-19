import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Share2, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, toggleWishlist, isInWishlist, getProductById, getAllProducts } = useShop();
    const product = getProductById(id);
    const [selectedSize, setSelectedSize] = useState('S');
    const [activeImg, setActiveImg] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    if (!product) {
        return (
            <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
                <h2 className="serif">PRODUCT NOT FOUND</h2>
                <Link to="/shop/all" style={{ marginTop: '2rem', display: 'inline-block', textDecoration: 'underline' }}>BACK TO SHOP</Link>
            </div>
        );
    }

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const nextImg = () => setActiveImg((prev) => (prev + 1) % product.images.length);
    const prevImg = () => setActiveImg((prev) => (prev - 1 + product.images.length) % product.images.length);

    const handleAddToCart = (e) => {
        // Trigger animation
        setIsAnimating(true);

        // Create flying element
        const button = e.currentTarget;
        const buttonRect = button.getBoundingClientRect();
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = '👗';
        flyingItem.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        flyingItem.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
        document.body.appendChild(flyingItem);

        // Animate to cart
        setTimeout(() => {
            flyingItem.classList.add('fly-to-cart');
        }, 10);

        // Add to cart and cleanup
        setTimeout(() => {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.priceNum,
                img: product.images[0]
            }, selectedSize);

            flyingItem.remove();
            setIsAnimating(false);
        }, 800);
    };

    const handleToggleWishlist = () => {
        const wasInWishlist = isInWishlist(product.id);

        toggleWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.images[0]
        });

        // Show heart animation when adding to wishlist
        if (!wasInWishlist) {
            setShowHeartAnimation(true);
            setTimeout(() => setShowHeartAnimation(false), 1000);
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out ${product.name} on MORBEI`;

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'instagram':
                // Instagram doesn't support direct sharing via URL, so we copy the link
                navigator.clipboard.writeText(url);
                alert('Link copied! Share it on Instagram.');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            default:
                break;
        }
        setIsShareOpen(false);
    };

    // Recommendations: 4 random products excluding current (same as Wishlist)
    const recommendations = useMemo(() => {
        const allProducts = getAllProducts();
        const available = allProducts.filter(p => p.id !== id);
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [id, getAllProducts]);

    return (
        <div className="product-detail-page">
            <div className="pd-container">
                {/* Image Section - Grid Layout */}
                <div className="pd-images-grid">
                    <div className="pd-big-image">
                        <img src={product.images[0]} alt={product.name} />
                    </div>
                    <div className="pd-small-images">
                        <div className="pd-small-img">
                            <img src={product.images[1]} alt={product.name} />
                        </div>
                        <div className="pd-small-img">
                            <img src={product.images[2]} alt={product.name} />
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="pd-info-section">
                    <div className="pd-header">
                        <h1 className="serif">{product.name}</h1>
                        <p className="pd-price">{product.price}</p>
                    </div>

                    <div className="pd-color-selector">
                        <div className="color-swatch beige"></div>
                        <span className="color-label">Ecru</span>
                    </div>

                    <div className="pd-size-selector">
                        <div className="pd-sizes-row">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    className={`pd-size-text ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <button className="pd-guide-link">Size Guide</button>
                    </div>

                    <div className="pd-actions">
                        <button
                            className="pd-add-bag-btn"
                            onClick={handleAddToCart}
                            disabled={isAnimating}
                        >
                            {isAnimating ? 'ADDING...' : 'ADD TO BAG'}
                        </button>
                        <button
                            className="pd-wishlist-icon-btn"
                            onClick={handleToggleWishlist}
                        >
                            <svg
                                width="20"
                                height="32"
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

                    <p className="pd-model-info">Model is wearing size XS and is 173cm tall</p>

                    <div className="pd-accordion">
                        <AccordionItem title="DESCRIPTION" isOpen={activeAccordion === 'desc'} onClick={() => toggleAccordion('desc')}>
                            <p>{product.description}</p>
                        </AccordionItem>
                        <AccordionItem title="PRODUCT MEASUREMENTS" isOpen={activeAccordion === 'meas'} onClick={() => toggleAccordion('meas')}>
                            <p>Length: 105cm, Waist: 72cm (Size S)</p>
                        </AccordionItem>
                        <AccordionItem title="COMPOSITION AND CARE" isOpen={activeAccordion === 'comp'} onClick={() => toggleAccordion('comp')}>
                            <ul>
                                {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
                            </ul>
                        </AccordionItem>
                        <AccordionItem title="SHIPPING" isOpen={activeAccordion === 'ship'} onClick={() => toggleAccordion('ship')}>
                            <p>Free shipping on orders over RS. 10000. Returns accepted within 14 days.</p>
                        </AccordionItem>
                    </div>
                </div>
            </div>

            {/* Recommendations Section - same as Wishlist */}
            <div className="pd-recommendations">
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
                                <button
                                    type="button"
                                    className="rec-bookmark-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist({ id: prod.id, name: prod.name, price: prod.price, img: prod.images?.[0] || prod.img });
                                    }}
                                    aria-label={isInWishlist(prod.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <svg
                                        width="14"
                                        height="20"
                                        viewBox="0 0 24 40"
                                        fill={isInWishlist(prod.id) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinejoin="miter"
                                        strokeLinecap="square"
                                    >
                                        <path d="M 6 4 H 18 V 36 L 12 30 L 6 36 V 4 Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="accordion-item">
            <button className="accordion-header" onClick={onClick}>
                {title}
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="accordion-inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
