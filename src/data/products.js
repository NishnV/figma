// Central product database – synced with admin catalog (public/products.json).
// When you export from Admin → Products and save as public/products.json, update this file
// with the same data so the built dist works without relying on fetch.

export const products = {
    "NEW IN": [
        { "id": "miriam-wide-leg-trousers", "name": "MIRIAM WIDE LEG TROUSERS", "price": "RS. 4790", "priceNum": 4790, "category": "NEW IN", "description": "", "images": ["/uploads/1771159216434-9m1jcza.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "rachel-satin-gown", "name": "rachel satin gown", "price": "RS. 7870", "priceNum": 7870, "category": "NEW IN", "description": "", "images": ["/uploads/1771159546170-r184m0g.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "mitchell-top-", "name": "mitchell top ", "price": "RS. 4290", "priceNum": 4290, "category": "NEW IN", "description": "", "images": ["/uploads/1771159611418-0a9m2yh.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "clara-pleated-trousers", "name": "clara pleated trousers", "price": "RS. 5290", "priceNum": 5290, "category": "NEW IN", "description": "", "images": ["/uploads/1771159344444-m4eomho.jpg", "/uploads/1771160435601-vy02wfn.jpg", "/uploads/1771160480178-6w5c6ar.png"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] }
    ],
    "DRESSES": [
        { "id": "bella-dress", "name": "BELLA DRESS", "price": "RS. 7290", "priceNum": 7290, "category": "DRESSES", "description": "", "images": ["/uploads/1771159063295-opktkl4.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "clara-blazer", "name": "clara BLAZER", "price": "RS. 5690", "priceNum": 5690, "category": "DRESSES", "description": "", "images": ["/uploads/1771159991581-351mkyu.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "christi-halter-dress", "name": "CHRISTI HALTER DRESS", "price": "RS. 6290", "priceNum": 6290, "category": "DRESSES", "description": "", "images": ["/uploads/1771160030358-kdcohjt.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "morwyn-coord", "name": "MORWYN COORD", "price": "RS. 10290", "priceNum": 10290, "category": "DRESSES", "description": "", "images": ["/uploads/1771160103446-kpx0cf6.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "diane-dress", "name": "DIANE DRESS", "price": "RS. 5290", "priceNum": 5290, "category": "DRESSES", "description": "", "images": ["/uploads/1771160268356-x3f46rq.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] }
    ],
    "TOPS": [
        { "id": "scarlet-top", "name": "scarlet top", "price": "RS. 4290", "priceNum": 4290, "category": "TOPS", "description": "", "images": ["/uploads/1771159694287-blgghih.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "jade-halter-top", "name": "JADE HALTER TOP", "price": "RS. 4290", "priceNum": 4290, "category": "TOPS", "description": "", "images": ["/uploads/1771159809352-infp1b6.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "miriam-sculpted-jacket", "name": "MIRIAM SCULPTED JACKET", "price": "RS. 5790", "priceNum": 5790, "category": "TOPS", "description": "", "images": ["/uploads/1771160153139-8wxm5ym.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "clara-modal-top", "name": "CLARA MODAL TOP", "price": "RS. 1290", "priceNum": 1290, "category": "TOPS", "description": "", "images": ["/uploads/1771160337555-idftpnm.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] }
    ],
    "BOTTOMS": [
        { "id": "bobbi-trousers", "name": "BOBBI TROUSERS", "price": "RS. 5790", "priceNum": 5790, "category": "BOTTOMS", "description": "", "images": ["/uploads/1771159881342-5er8vb1.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] },
        { "id": "ann-pleated-trousers", "name": "ANN PLEATED TROUSERS", "price": "RS. 5490", "priceNum": 5490, "category": "BOTTOMS", "description": "", "images": ["/uploads/1771160379051-xdi267v.jpg"], "sizes": ["XXS", "XS", "S", "M", "L", "XL"], "details": [] }
    ]
};

// Helper function to get all products
export const getAllProducts = () => {
    return Object.values(products).flat();
};

// Helper function to get product by ID
export const getProductById = (id) => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (category) => {
    if (category === 'all') {
        return getAllProducts();
    }
    return products[category.toUpperCase()] || [];
};
