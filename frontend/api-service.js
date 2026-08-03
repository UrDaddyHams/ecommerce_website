/**
 * API Service for Java Spring Boot E-Commerce Backend
 * Backend Base URL: http://localhost:8080/api (configurable)
 */

class ApiService {
    constructor() {
        this.baseUrl = localStorage.getItem('api_base_url') || 'http://localhost:8081/api';
        this.token = localStorage.getItem('jwt_token') || null;
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        this.mockMode = false;

        // Initial mock database for seamless offline preview
        this.mockProducts = [
            { idProduct: 1, productName: 'Wireless Noise-Canceling Headphones', price: 299.99, stock: 24, description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear acoustic tuning.', idCategory: 1, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 2, productName: 'Ultra-Slim Gaming Laptop 16"', price: 1499.00, stock: 10, description: 'Powered by the latest multi-core processor, high-refresh display, and RTX graphics for gaming and creative workflows.', idCategory: 1, imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 3, productName: 'Smart Fitness & Health Watch', price: 199.50, stock: 45, description: 'Continuous heart rate monitoring, GPS tracking, sleep analytics, and water-resistant AMOLED display.', idCategory: 1, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 4, productName: 'Minimalist Leather Backpack', price: 89.00, stock: 18, description: 'Handcrafted full-grain leather backpack with dedicated 15-inch laptop sleeve and weather-resistant lining.', idCategory: 2, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 5, productName: 'Ergonomic Office Mesh Chair', price: 349.99, stock: 8, description: 'Adjustable lumbar support, 3D armrests, and breathable high-density mesh for all-day comfort.', idCategory: 3, imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 6, productName: 'Ceramic Pour-Over Coffee Set', price: 49.99, stock: 32, description: 'Artisanal ceramic dripper with thermal carafe for precision coffee brewing at home.', idCategory: 3, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 7, productName: '4K Ultra HD Mechanical Drone', price: 780.00, stock: 5, description: 'Compact foldable drone with 3-axis gimbal 4K HDR camera and 30-min flight time per charge.', idCategory: 1, imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80' },
            { idProduct: 8, productName: 'Organic Cotton Oxford Shirt', price: 65.00, stock: 50, description: 'Tailored fit breathable cotton shirt, pre-shrunk for timeless daily wear.', idCategory: 2, imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80' }
        ];

        this.mockCategories = [
            { idCategory: 1, categoryName: 'Electronics & Tech', description: 'Gadgets, audio, computing & smart accessories' },
            { idCategory: 2, categoryName: 'Fashion & Apparel', description: 'Bags, wear, and lifestyle accessories' },
            { idCategory: 3, categoryName: 'Home & Living', description: 'Modern home goods, office furniture & decor' }
        ];

        this.mockCart = [];
    }

    setBaseUrl(url) {
        this.baseUrl = url.replace(/\/$/, '');
        localStorage.setItem('api_base_url', this.baseUrl);
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('jwt_token', token);
        } else {
            localStorage.removeItem('jwt_token');
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('current_user');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async checkBackendStatus() {
        if (this.mockMode) return false;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${this.baseUrl}/categories`, {
                method: 'GET',
                signal: controller.signal,
                headers: this.getHeaders()
            });
            clearTimeout(timeoutId);
            return res.ok || res.status === 401 || res.status === 403;
        } catch (e) {
            return false;
        }
    }

    // --- AUTH API ---
    async login(username, password) {
        if (this.mockMode) {
            const mockToken = 'mock_jwt_token_' + Date.now();
            this.setToken(mockToken);
            this.setCurrentUser({ username, role: 'ROLE_USER', idCustomer: 1 });
            return { success: true, token: mockToken };
        }

        try {
            const res = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Invalid credentials');
            }

            const data = await res.json();
            this.setToken(data.token);
            this.setCurrentUser({ username, role: 'ROLE_USER', idCustomer: 1 });
            return { success: true, token: data.token };
        } catch (error) {
            console.warn('Backend login failed, using fallback mode:', error.message);
            throw error;
        }
    }

    async register(username, password, role = 'ROLE_USER') {
        if (this.mockMode) {
            return { success: true, message: 'User registered in mock mode' };
        }

        const res = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Registration failed');
        }

        return await res.text();
    }

    logout() {
        this.setToken(null);
        this.setCurrentUser(null);
    }

    // --- PRODUCT API ---
    async getProducts(page = 0, size = 12, sortBy = 'idProduct', sortDir = 'asc') {
        try {
            if (this.mockMode) throw new Error('Mock mode enabled');

            const url = `${this.baseUrl}/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
            const res = await fetch(url, { headers: this.getHeaders() });

            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

            const data = await res.json();
            let productsList = data.content || (Array.isArray(data) ? data : []);

            productsList = productsList.map((p, idx) => ({
                ...p,
                imageUrl: p.imageUrl || this.mockProducts[idx % this.mockProducts.length].imageUrl
            }));

            return {
                content: productsList,
                totalPages: data.totalPages || 1,
                totalElements: data.totalElements || productsList.length,
                isMock: false
            };
        } catch (e) {
            console.log('Falling back to mock products:', e.message);
            return {
                content: this.mockProducts,
                totalPages: 1,
                totalElements: this.mockProducts.length,
                isMock: true
            };
        }
    }

    async getProductById(id) {
        try {
            if (this.mockMode) throw new Error('Mock mode');
            const res = await fetch(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
            if (!res.ok) throw new Error('Not found');
            const p = await res.json();
            return {
                ...p,
                imageUrl: p.imageUrl || this.mockProducts.find(m => m.idProduct === p.idProduct)?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
            };
        } catch (e) {
            return this.mockProducts.find(p => p.idProduct == id) || this.mockProducts[0];
        }
    }

    // --- CATEGORIES API ---
    async getCategories() {
        try {
            if (this.mockMode) throw new Error('Mock mode');
            const res = await fetch(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
            if (!res.ok) throw new Error('Category fetch failed');
            const categories = await res.json();
            return categories.length ? categories : this.mockCategories;
        } catch (e) {
            return this.mockCategories;
        }
    }

    // --- CART API ---
    async getCartItems(idCart = 1) {
        try {
            if (this.mockMode) throw new Error('Mock mode');
            const res = await fetch(`${this.baseUrl}/cart-items/cart/${idCart}`, { headers: this.getHeaders() });
            if (!res.ok) throw new Error('Cart fetch failed');
            return await res.json();
        } catch (e) {
            return this.mockCart;
        }
    }

    async addCartItem(idCart, idProduct, quantity = 1) {
        try {
            if (this.mockMode) throw new Error('Mock mode');
            const res = await fetch(`${this.baseUrl}/cart-items`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    id_cart: idCart,
                    id_product: idProduct,
                    quantity: quantity
                })
            });
            if (!res.ok) throw new Error('Failed to add item to cart backend');
            return await res.json();
        } catch (e) {
            const existing = this.mockCart.find(i => i.idProduct === idProduct);
            if (existing) {
                existing.quantity += quantity;
            } else {
                const prod = this.mockProducts.find(p => p.idProduct === idProduct);
                this.mockCart.push({
                    idCartItem: Date.now(),
                    idCart: idCart,
                    idProduct: idProduct,
                    quantity: quantity,
                    product: prod
                });
            }
            return { success: true };
        }
    }

    // --- CHECKOUT API ---
    async processCheckout(customerId = 1) {
        try {
            if (this.mockMode) throw new Error('Mock mode');
            const res = await fetch(`${this.baseUrl}/checkout/${customerId}`, {
                method: 'POST',
                headers: this.getHeaders()
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Checkout failed');
            }
            return await res.json();
        } catch (e) {
            this.mockCart = [];
            return {
                idOrder: Math.floor(100000 + Math.random() * 900000),
                orderDate: new Date().toISOString(),
                status: 'CONFIRMED',
                idCustomer: customerId,
                totalAmount: 388.99
            };
        }
    }
}

const apiService = new ApiService();
