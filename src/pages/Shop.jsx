import React, { useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Shop.css';

const Shop = ({ category = "DRESSES" }) => {
    const { getProductsByCategory, getAllProducts, toggleWishlist, isInWishlist } = useShop();
    const [viewMode, setViewMode] = React.useState(2); // Default to 2 columns
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [showBackToTop, setShowBackToTop] = React.useState(false);
    const shopRef = React.useRef(null);

    // Filter and Sort states
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [isSortOpen, setIsSortOpen] = React.useState(false);
    const [selectedSizes, setSelectedSizes] = React.useState([]);
    const [selectedColors, setSelectedColors] = React.useState([]);
    const [priceRange, setPriceRange] = React.useState({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = React.useState('');

    const filterRef = useRef(null);
    const sortRef = useRef(null);

    // Handle special category cases
    let fetchCategory = category?.toUpperCase().replace("-", " ") || "ALL";
    if (fetchCategory === "NEW IN 1") fetchCategory = "NEW IN";
    
    let currentCategory = fetchCategory;
    if (currentCategory === "ALL") currentCategory = "ALL PRODUCTS";

    // Initial product fetch
    let rawProducts = getProductsByCategory(fetchCategory);

    // Apply filters
    let filteredProducts = rawProducts.filter(product => {
        // Size Filter
        if (selectedSizes.length > 0) {
            const productSizes = product.sizes || [];
            if (!selectedSizes.some(s => productSizes.includes(s))) return false;
        }

        // Color Filter (Assuming products might have colors, or just showing how it would work)
        // If your product data doesn't have colors, we can skip or assume they match for now
        // if (selectedColors.length > 0 && !selectedColors.includes(product.color)) return false;

        // Price Filter
        const price = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
        if (price < priceRange.min || price > priceRange.max) return false;

        return true;
    });

    // Handle Search Override
    if (searchQuery) {
        currentCategory = `SEARCH RESULTS FOR: ${searchQuery.toUpperCase()}`;
        filteredProducts = getAllProducts().filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Map to the format used in UI
    const displayProducts = filteredProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.images?.[0] || p.img,
        sizes: p.sizes || ['S', 'M', 'L']
    }));

    // Apply sorting
    const sortedProducts = [...displayProducts].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));

        switch (sortBy) {
            case 'price-low': return priceA - priceB;
            case 'price-high': return priceB - priceA;
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            default: return 0;
        }
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setPriceRange({ min: 0, max: 10000 });
    };

    return (
        <>
            <div className="shop-page-v2">
            <div className="shop-controls-bar">
                <div className="view-options">
                    <button
                        className={`view-btn ${viewMode === 1 ? 'active' : ''}`}
                        onClick={() => setViewMode(1)}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
                            <rect x="1" y="1" width="16" height="16" strokeWidth="1.2" />
                        </svg>
                    </button>
                    <button
                        className={`view-btn ${viewMode === 2 ? 'active' : ''}`}
                        onClick={() => setViewMode(2)}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
                            <rect x="1" y="1" width="16" height="16" strokeWidth="1.2" />
                            <line x1="9" y1="1" x2="9" y2="17" strokeWidth="1.2" />
                        </svg>
                    </button>
                    <button
                        className={`view-btn ${viewMode === 4 ? 'active' : ''}`}
                        onClick={() => setViewMode(4)}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
                            <rect x="1" y="1" width="16" height="16" strokeWidth="1.2" />
                            <line x1="9" y1="1" x2="9" y2="17" strokeWidth="1.2" />
                            <line x1="1" y1="9" x2="17" y2="9" strokeWidth="1.2" />
                        </svg>
                    </button>
                </div>
                <div className="shop-category-title">{currentCategory}</div>
                <div className="filter-sort">
                    {/* FILTER TRIGGER */}
                    <button
                        className="dropdown-trigger"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        FILTER
                    </button>

                    {/* SORT TRIGGER */}
                    <button
                        className="dropdown-trigger"
                        onClick={() => setIsSortOpen(true)}
                    >
                        SORT
                    </button>
                </div>
            </div>

            {/* SIDE PANELS BACKDROP */}
            <div
                className={`side-panel-backdrop ${(isFilterOpen || isSortOpen) ? 'visible' : ''}`}
                onClick={() => {
                    setIsFilterOpen(false);
                    setIsSortOpen(false);
                }}
            />

            {/* FILTER SIDE PANEL */}
            <div className={`side-panel filter-panel ${isFilterOpen ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <h3>FILTER</h3>
                    <button className="side-panel-close" onClick={() => setIsFilterOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="side-panel-content">
                    <div className="dropdown-section">
                        <h4>SIZE</h4>
                        <div className="filter-options">
                            {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <label key={size} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedSizes.includes(size)}
                                        onChange={() => toggleSize(size)}
                                    />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="dropdown-section">
                        <h4>COLOR</h4>
                        <div className="filter-options">
                            {['Black', 'White', 'Beige', 'Navy', 'Brown', 'Grey'].map(color => (
                                <label key={color} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedColors.includes(color)}
                                        onChange={() => toggleColor(color)}
                                    />
                                    <span>{color}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="dropdown-section">
                        <h4>PRICE RANGE</h4>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className="side-panel-footer">
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        CLEAR ALL
                    </button>
                    <button className="apply-btn" onClick={() => setIsFilterOpen(false)}>
                        APPLY
                    </button>
                </div>
            </div>

            {/* SORT SIDE PANEL */}
            <div className={`side-panel sort-panel ${isSortOpen ? 'open' : ''}`}>
                <div className="side-panel-header">
                    <h3>SORT</h3>
                    <button className="side-panel-close" onClick={() => setIsSortOpen(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="side-panel-content">
                    <button
                        className={`sort-option ${sortBy === 'price-low' ? 'active' : ''}`}
                        onClick={() => { setSortBy('price-low'); setIsSortOpen(false); }}
                    >
                        PRICE: LOW TO HIGH
                    </button>
                    <button
                        className={`sort-option ${sortBy === 'price-high' ? 'active' : ''}`}
                        onClick={() => { setSortBy('price-high'); setIsSortOpen(false); }}
                    >
                        PRICE: HIGH TO LOW
                    </button>
                    <button
                        className={`sort-option ${sortBy === 'name-asc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('name-asc'); setIsSortOpen(false); }}
                    >
                        NAME: A-Z
                    </button>
                    <button
                        className={`sort-option ${sortBy === 'name-desc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('name-desc'); setIsSortOpen(false); }}
                    >
                        NAME: Z-A
                    </button>
                    <button
                        className={`sort-option ${sortBy === '' ? 'active' : ''}`}
                        onClick={() => { setSortBy(''); setIsSortOpen(false); }}
                    >
                        DEFAULT
                    </button>
                </div>
            </div>

            <div className="shop-main-content">
                {sortedProducts.length > 0 ? (
                    <div className={`products-grid col-${viewMode}`}>
                        {sortedProducts.map((product, idx) => (
                            <div className={`product-item reveal reveal-up reveal-delay-${(idx % 4) + 1}`} key={idx}>
                                <Link to={`/product/${product.id}`} className="product-link">
                                    <div className="product-image-container">
                                        <img src={product.img} alt={product.name} />
                                        <div className="product-sizes">
                                            {(product.sizes || ['S', 'M', 'L']).map(size => (
                                                <span key={size}>{size}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="product-footer">
                                        <div className="p-detail">
                                            <span className="p-name">{product.name}</span>
                                            <span className="p-price">{product.price}</span>
                                        </div>
                                        <button
                                            className={`wishlist-black ${isInWishlist(product.id) ? 'active' : ''}`}
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
                        ))}
                    </div>
                ) : (
                    <div className="no-products-found">
                        <h2>NO PRODUCTS FOUND</h2>
                        <p>SORRY, WE COULDN'T FIND ANY PRODUCTS MATCHING YOUR SEARCH.</p>
                        <Link to="/shop/all" className="back-to-shop">VIEW ALL PRODUCTS</Link>
                    </div>
                )}
            </div>

            {/* Space before footer */}
            <div className="shop-spacer"></div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <div className="back-to-top-container">
                    <button 
                        className="back-to-top-btn"
                        onClick={scrollToTop}
                        title="Back to top"
                    >
                        BACK TO TOP
                    </button>
                </div>
            )}
            </div>
        </>
    );
};

export default Shop;
