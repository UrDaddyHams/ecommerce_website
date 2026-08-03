import { useState, useEffect } from 'react';
import { getProducts, getCategories, addCartItem, getReviewsByProduct } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import ReviewModal from './ReviewModal';

export default function ProductCatalog({ cartId, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productReviews, setProductReviews] = useState({}); // Stores ratings/counts by product ID
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('productName');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDir]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(0, 100, sortBy, sortDir),
        getCategories(),
      ]);
      const loadedProducts = prodRes.data.content || prodRes.data || [];
      setProducts(loadedProducts);
      setCategories(catRes.data || []);

      // Fetch reviews for each product to calculate average ratings
      const reviewsMap = {};
      await Promise.all(
          loadedProducts.map(async (prod) => {
            try {
              const revRes = await getReviewsByProduct(prod.idProduct);
              const revs = revRes.data || [];
              if (revs.length > 0) {
                const avg = (revs.reduce((sum, r) => sum + (r.rating || 0), 0) / revs.length).toFixed(1);
                reviewsMap[prod.idProduct] = { avg: Number(avg), count: revs.length };
              } else {
                reviewsMap[prod.idProduct] = { avg: 0, count: 0 };
              }
            } catch {
              reviewsMap[prod.idProduct] = { avg: 0, count: 0 };
            }
          })
      );
      setProductReviews(reviewsMap);
    } catch (err) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!cartId) {
      showToast('Cart not found. Please try again.', 'error');
      return;
    }
    setAddingToCart((prev) => ({ ...prev, [product.idProduct]: true }));
    try {
      await addCartItem(cartId, product.idProduct, 1);
      showToast(`${product.productName} added to cart!`, 'success');
      onCartUpdate?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to add item';
      showToast(typeof msg === 'string' ? msg : 'Failed to add item', 'error');
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.idProduct]: false }));
    }
  };

  const getCategoryName = (idCategory) => {
    const cat = categories.find((c) => c.idCategory === idCategory);
    return cat?.categoryName || 'Uncategorized';
  };

  const filtered = products.filter((p) => {
    const matchCategory = !selectedCategory || p.idCategory === selectedCategory;
    const matchSearch =
        !searchTerm ||
        p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getStockBadge = (stock) => {
    if (!stock || stock <= 0) return { cls: 'badge-danger', text: 'Out of Stock' };
    if (stock <= 5) return { cls: 'badge-warning', text: `Low Stock (${stock})` };
    return { cls: 'badge-success', text: 'In Stock' };
  };

  return (
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1>Product Catalog</h1>
            <p className="subtitle">{filtered.length} products available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
                id="search-products"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-controls">
            <select
                id="sort-products"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDir(dir);
                }}
            >
              <option value="productName-asc">Name A-Z</option>
              <option value="productName-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button
              className={`pill ${!selectedCategory ? 'pill-active' : ''}`}
              onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
              <button
                  key={cat.idCategory}
                  className={`pill ${selectedCategory === cat.idCategory ? 'pill-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.idCategory)}
              >
                {cat.categoryName}
              </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
            <div className="loading-state">
              <div className="spinner-lg" />
              <p>Loading products...</p>
            </div>
        ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
        ) : (
            <div className="product-grid">
              {filtered.map((product) => {
                const stock = getStockBadge(product.stock);
                const revData = productReviews[product.idProduct] || { avg: 0, count: 0 };
                return (
                    <div key={product.idProduct} className="product-card">
                      <div className="product-image-placeholder">
                        <span className="product-emoji">📦</span>
                      </div>
                      <div className="product-info">
                        <div className="product-top-row">
                          <span className="category-tag">{getCategoryName(product.idCategory)}</span>
                          <span className={`badge ${stock.cls}`}>{stock.text}</span>
                        </div>
                        <h3 className="product-name">{product.productName}</h3>

                        {/* Average Rating Display on Product Card */}
                        <div
                            className="product-rating-summary"
                            onClick={() => setReviewProduct(product)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}
                            title="Click to view reviews"
                        >
                          <span style={{ color: '#f59e0b' }}>★</span>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      {revData.count > 0 ? revData.avg : 'No reviews'}
                    </span>
                          {revData.count > 0 && (
                              <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>({revData.count})</span>
                          )}
                        </div>

                        <p className="product-desc">{product.description || 'No description available.'}</p>

                        <div className="product-bottom">
                          <span className="product-price">${product.price?.toFixed(2)}</span>
                          <div className="product-actions">
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => setReviewProduct(product)}
                                title="Reviews"
                            >
                              ⭐ Reviews
                            </button>
                            <button
                                id={`add-to-cart-${product.idProduct}`}
                                className="btn btn-sm btn-primary"
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.stock || product.stock <= 0 || addingToCart[product.idProduct]}
                            >
                              {addingToCart[product.idProduct] ? (
                                  <span className="spinner" />
                              ) : (
                                  '+ Cart'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {/* Review Modal */}
        {reviewProduct && (
            <ReviewModal
                product={reviewProduct}
                onClose={() => {
                  setReviewProduct(null);
                  fetchData(); // Refresh reviews summary when modal closes
                }}
            />
        )}
      </div>
  );
}