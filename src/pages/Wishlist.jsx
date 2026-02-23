import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Wishlist.css';
import './ProductDetail.css';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart, getAllProducts, getProductById, isInWishlist } = useShop();

    const handleMoveToBag = (item) => {
        const fullProduct = getProductById(item.id);
        const product = fullProduct
            ? { id: fullProduct.id, name: fullProduct.name, price: fullProduct.price, priceNum: fullProduct.priceNum, img: fullProduct.images?.[0] || fullProduct.img }
            : { ...item, priceNum: typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0 };
        addToCart(product, 'S');
        toggleWishlist(item);
    };

    // Get recommendations - filter out wishlist items and get 4 random products
    const recommendations = useMemo(() => {
        const allProducts = getAllProducts();
        const wishlistIds = wishlist.map(item => item.id);
        const availableProducts = allProducts.filter(p => !wishlistIds.includes(p.id));
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [wishlist, getAllProducts]);

    return (
        <div className="wishlist-page">
            <h1 className="wishlist-title">WISHLISTED ITEMS</h1>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <p>YOUR WISHLIST IS CURRENTLY EMPTY. START BUILDING YOUR PERSONAL COLLECTION.</p>
                    <Link to="/shop/all" className="continue-shopping">EXPLORE COLLECTIONS</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <div className="wishlist-img-wrapper">
                                <Link to={`/product/${item.id}`}>
                                    <img src={item.img} alt={item.name} />
                                </Link>
                                <button
                                    className="wishlist-remove-icon"
                                    onClick={() => toggleWishlist(item)}
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
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="wishlist-item-footer">
                                <div className="wishlist-item-info">
                                    <h3 className="wishlist-item-name">{item.name}</h3>
                                    <p className="wishlist-item-price">{item.price}</p>
                                </div>
                                <button
                                    className="move-to-bag-btn"
                                    onClick={() => handleMoveToBag(item)}
                                >
                                    MOVE TO BAG
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendations Section */}
            <div className="wishlist-recommendations">
                <h3 className="wishlist-rec-title">YOU MIGHT BE INTERESTED IN</h3>
                <div className="wishlist-rec-grid">
                    {recommendations.map((prod, index) => (
                        <div className={`wishlist-rec-product reveal reveal-up reveal-delay-${index + 1}`} key={prod.id}>
                            <Link to={`/product/${prod.id}`} className="wishlist-rec-image-wrapper">
                                <img src={prod.images?.[0] || prod.img} alt={prod.name} />
                                <div className="product-sizes">
                                    {['XXS', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                        <span key={size}>{size}</span>
                                    ))}
                                </div>
                            </Link>
                                <div className="wishlist-rec-details-row">
                                <Link to={`/product/${prod.id}`} className="wishlist-rec-info-text">
                                    <span className="wishlist-rec-name">{prod.name}</span>
                                    <span className="wishlist-rec-price">{prod.price}</span>
                                </Link>
                                <button
                                    type="button"
                                    className={`wishlist-rec-bookmark-btn ${isInWishlist(prod.id) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist({ id: prod.id, name: prod.name, price: prod.price, img: prod.images?.[0] || prod.img });
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
                                            fill={isInWishlist(prod.id) ? "currentColor" : "none"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
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

export default Wishlist;
