import axios from 'axios';  //javascript library for sending http requests from web browsers

const API = axios.create({
    baseURL: 'http://16.192.160.63:2021/api',
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {        //runs before every request goes out. it looks into the browser's localStorage for a saved jwt and attaches it to the http heaader as authorization bearer token
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//handle 401, 403 redirect to login
API.interceptors.response.use(        //if backend returns a 401 or 403 error(and its not happening on the login page) it automatically clears out the expired token from storage and starts an event saying session expired
    (res) => res,
    (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            if (!err.config?.url?.includes('/auth/')) {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('customerId');
                window.dispatchEvent(new Event('auth-expired'));
            }
        }
        return Promise.reject(err);
    }
);

//helper functions that ur react component call to fetch or save data
//auth
export const login = (username, password) =>     //sends credentials or registeration data to backend authentication routes
    API.post('/auth/login', { username, password });

export const register = (data) =>
    API.post('/auth/register', data);

//products
export const getProducts = (page = 0, size = 100, sortBy = 'idProduct', sortDir = 'asc') =>
    API.get('/products', { params: { page, size, sortBy, sortDir } });   //fetchess products, sorting rules

export const getProductById = (id) =>
    API.get(`/products/${id}`);

//categories
export const getCategories = () =>
    API.get('/categories');

//carts
export const getAllCarts = () =>
    API.get('/carts');

export const getCartById = (id) =>
    API.get(`/carts/${id}`);

export const createCart = (cart) =>
    API.post('/carts', cart);

//cart items
export const getCartItems = (idCart) =>
    API.get(`/cart-items/cart/${idCart}`);

export const addCartItem = (idCart, idProduct, quantity) =>
    API.post('/cart-items', { id_cart: idCart, id_product: idProduct, quantity });

export const updateCartItem = (idCartItem, idCart, idProduct, quantity) =>
    API.put(`/cart-items/${idCartItem}`, { id_cart: idCart, id_product: idProduct, quantity });

export const removeCartItem = (idCartItem) =>
    API.delete(`/cart-items/${idCartItem}`);

//orders
export const getOrdersByUser = (idCustomer) =>
    API.get(`/orders/customer/${idCustomer}`);

export const getOrdersByCustomer = (idCustomer) =>
    API.get(`/orders/customer/${idCustomer}`);

export const getOrderById = (id) =>
    API.get(`/orders/${id}`);

//checkout - Updated to explicitly pass customer parameters and payment options securely
export const checkout = (paymentMethod) => {
    const username = localStorage.getItem('username');
    const customerId = localStorage.getItem('customerId');

    // Hits the backend checkout route with required params and body
    return API.post(`/checkout/username/${username}?paymentMethod=${encodeURIComponent(paymentMethod)}`, {
        customer: {
            idCustomer: customerId ? Number(customerId) : null
        }
    });
};

//shipments
export const getAllShipments = () =>
    API.get('/shipments');

export const getShipmentByOrderId = (idOrder) =>
    API.get(`/shipments/order/${idOrder}`);

export const getShipmentsByUser = (userId) => {
    return API.get(`/shipments/user/${userId}`);
};

//reviews
export const getReviewsByProduct = (idProduct) =>
    API.get(`/reviews/product/${idProduct}`);

export const postReview = (rating, comment, idCustomer, idProduct) =>
    API.post('/reviews', {
        rating,
        comment,
        reviewDate: new Date().toISOString(),
        customer: { idCustomer },
        product: { idProduct },
    });

export default API;