import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('morbei_products');
        return saved ? JSON.parse(saved) : initialProducts;
    });
    // On deploy (e.g. Netlify): when there's no saved products, load from /products.json so the site shows your catalog
    useEffect(() => {
        if (localStorage.getItem('morbei_products')) return;
        fetch('/products.json')
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    setProducts(data);
                }
            })
            .catch(() => {});
    }, []);

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('morbei_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('morbei_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('morbei_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('morbei_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('morbei_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('morbei_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('morbei_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('morbei_user');
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // Product CRUD
    const addProduct = (product) => {
        const category = product.category.toUpperCase();
        setProducts(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), product]
        }));
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => {
            const newProducts = { ...prev };
            // 1. Remove from all existing categories
            Object.keys(newProducts).forEach(cat => {
                newProducts[cat] = newProducts[cat].filter(p => p.id !== updatedProduct.id);
            });
            // 2. Add to the new/correct category
            const category = updatedProduct.category.toUpperCase();
            if (!newProducts[category]) newProducts[category] = [];
            newProducts[category].push(updatedProduct);
            return newProducts;
        });
    };

    const deleteProduct = (productId) => {
        setProducts(prev => {
            const newProducts = { ...prev };
            Object.keys(newProducts).forEach(cat => {
                newProducts[cat] = newProducts[cat].filter(p => p.id !== productId);
            });
            // Cleanup empty categories if necessary
            return newProducts;
        });
    };

    const getAllProducts = () => {
        return Object.values(products).flat();
    };

    const getProductsByCategory = (category) => {
        if (!category || category.toLowerCase() === 'all') return getAllProducts();
        return products[category.toUpperCase()] || [];
    };

    const getProductById = (id) => {
        return getAllProducts().find(p => p.id === id);
    };

    const addToCart = (product, size) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id && item.size === size);
            if (exists) {
                return prev.map(item =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, size, quantity: 1 }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(prev => prev.filter(item =>
            !(String(item.id) === String(productId) && String(item.size) === String(size))
        ));
    };

    const updateQuantity = (productId, size, delta) => {
        setCart(prev => {
            const item = prev.find(i => String(i.id) === String(productId) && String(i.size) === String(size));
            if (item && item.quantity === 1 && delta === -1) {
                return prev.filter(i => !(String(i.id) === String(productId) && String(i.size) === String(size)));
            }
            return prev.map(i => {
                if (String(i.id) === String(productId) && String(i.size) === String(size)) {
                    return { ...i, quantity: Math.max(1, i.quantity + delta) };
                }
                return i;
            });
        });
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <ShopContext.Provider value={{
            products,
            getAllProducts,
            getProductsByCategory,
            getProductById,
            cart,
            wishlist,
            user,
            login,
            logout,
            addProduct,
            updateProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
