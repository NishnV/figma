import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Wishlist.css';
import './ProductDetail.css';

const Wishlist = () => {
    const { wishlist, toggleWishlist, addToCart, getAllProducts, getProductById } = useShop();

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
                                        width="14"
                                        height="20"
                                        viewBox="0 0 24 40"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinejoin="miter"
                                        strokeLinecap="square"
                                    >
                                        <path d="M 6 4 H 18 V 36 L 12 30 L 6 36 V 4 Z" />
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
                                >
                                    <svg
                                        width="14"
                                        height="20"
                                        viewBox="0 0 24 40"
                                        fill="none"
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

export default Wishlist;
