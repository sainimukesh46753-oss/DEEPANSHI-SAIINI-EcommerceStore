const categories = [
  ["👗", "Fashion", "Clothing, shoes & accessories"],
  ["📱", "Electronics", "Phones, gadgets & accessories"],
  ["💄", "Beauty", "Beauty & personal care"],
  ["🏠", "Home & Kitchen", "Everything for your home"],
  ["🧸", "Kids & Toys", "Fun for every age"],
  ["💍", "Jewellery", "Jewellery & accessories"],
  ["📚", "Books", "Books & learning"],
  ["🏋️", "Sports", "Fitness & outdoor"],
];

const products = [
  { emoji: "👟", name: "Everyday Comfort Sneakers", category: "Fashion", price: "₹1,499", old: "₹2,499" },
  { emoji: "🎧", name: "Wireless Pro Headphones", category: "Electronics", price: "₹2,999", old: "₹4,999" },
  { emoji: "👜", name: "Classic Everyday Handbag", category: "Fashion", price: "₹1,199", old: "₹1,999" },
  { emoji: "⌚", name: "Smart Fitness Watch", category: "Electronics", price: "₹2,499", old: "₹3,999" },
  { emoji: "💡", name: "Modern Table Lamp", category: "Home & Kitchen", price: "₹899", old: "₹1,299" },
  { emoji: "🧴", name: "Daily Care Essentials", category: "Beauty", price: "₹699", old: "₹999" },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <div className="container nav">
          <a className="logo" href="/">DEEPANSHI<span>.</span></a>
          <div className="search"><span>⌕</span><input aria-label="Search products" placeholder="Search for products, brands and more..." /></div>
          <div className="nav-actions">
            <a href="#">♡ <span>Wishlist</span></a>
            <a href="#">♙ <span>Account</span></a>
            <a href="#">🛒 <span>Cart</span></a>
          </div>
        </div>
      </header>

      <nav className="category-nav">
        <div className="container category-links">
          <a href="#">All Categories</a>
          {categories.slice(0, 6).map(([emoji, name]) => <a href="#" key={name}>{emoji} {name}</a>)}
          <a href="#">Deals</a>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">WELCOME TO DEEPANSHI</p>
            <h1>Everything you need.<br /><em>All in one place.</em></h1>
            <p className="hero-text">Discover fashion, electronics, beauty, home essentials and more — with new products arriving every day.</p>
            <div className="hero-buttons"><a className="btn primary" href="#products">Shop Now →</a><a className="btn secondary" href="#categories">Explore Categories</a></div>
            <div className="trust"><span>✓ Secure shopping</span><span>✓ Easy returns</span><span>✓ Great value</span></div>
          </div>
          <div className="hero-art"><div className="orbit one">🛍️</div><div className="orbit two">📱</div><div className="orbit three">👗</div><div className="hero-card"><div>✨</div><strong>One marketplace.<br />Countless possibilities.</strong><small>Shop your world</small></div></div>
        </div>
      </section>

      <section id="categories" className="section container">
        <div className="section-head"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Find what you love</h2></div><a href="#">View all →</a></div>
        <div className="category-grid">{categories.map(([emoji, name, desc]) => <a className="category-card" href="#" key={name}><div className="category-icon">{emoji}</div><strong>{name}</strong><span>{desc}</span></a>)}</div>
      </section>

      <section id="products" className="section products-section">
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">TRENDING NOW</p><h2>Popular picks</h2></div><a href="#">See all products →</a></div>
          <div className="product-grid">{products.map((p) => <article className="product-card" key={p.name}><button className="heart" aria-label={`Add ${p.name} to wishlist`}>♡</button><div className="product-image">{p.emoji}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><div><strong>{p.price}</strong> <del>{p.old}</del></div><button className="add-cart">Add to Cart</button></div></article>)}</div>
        </div>
      </section>

      <section className="promo"><div className="container promo-inner"><div><p className="eyebrow">NEW TO DEEPANSHI?</p><h2>Get 10% off your first order</h2><p>Sign up for offers, new arrivals and exclusive deals.</p></div><a className="btn primary" href="#">Create Account →</a></div></section>

      <footer><div className="container footer-grid"><div><a className="logo" href="/">DEEPANSHI<span>.</span></a><p>Your world of shopping, all in one place.</p></div><div><strong>Shop</strong><a href="#">All Products</a><a href="#">Deals</a><a href="#">New Arrivals</a></div><div><strong>Help</strong><a href="#">Contact Us</a><a href="#">Shipping</a><a href="#">Returns</a></div><div><strong>Account</strong><a href="#">Sign In</a><a href="#">My Orders</a><a href="#">Wishlist</a></div></div><div className="container copyright">© 2026 DEEPANSHI. All rights reserved.</div></footer>
    </main>
  );
}