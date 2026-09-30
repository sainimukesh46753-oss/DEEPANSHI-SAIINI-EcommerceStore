"use client";

import { useMemo, useState } from "react";

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
  { emoji: "👟", name: "Everyday Comfort Sneakers", category: "Fashion", price: 1499, old: 2499 },
  { emoji: "🎧", name: "Wireless Pro Headphones", category: "Electronics", price: 2999, old: 4999 },
  { emoji: "👜", name: "Classic Everyday Handbag", category: "Fashion", price: 1199, old: 1999 },
  { emoji: "⌚", name: "Smart Fitness Watch", category: "Electronics", price: 2499, old: 3999 },
  { emoji: "💡", name: "Modern Table Lamp", category: "Home & Kitchen", price: 899, old: 1299 },
  { emoji: "🧴", name: "Daily Care Essentials", category: "Beauty", price: 699, old: 999 },
];

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  const filteredProducts = useMemo(() => products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const q = query.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [query, category]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2200);
  }

  function addToCart(name: string) {
    setCart((items) => [...items, name]);
    notify(`${name} added to cart`);
  }

  function toggleWishlist(name: string) {
    setWishlist((items) => items.includes(name) ? items.filter((x) => x !== name) : [...items, name]);
    notify(wishlist.includes(name) ? "Removed from wishlist" : "Added to wishlist");
  }

  function chooseCategory(name: string) {
    setCategory(name);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      {message && <div className="toast">{message}</div>}

      <header className="topbar">
        <div className="container nav">
          <button className="logo logo-button" onClick={() => { setCategory("All"); setQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>DEEPANSHI<span>.</span></button>
          <div className="search"><span>⌕</span><input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands and more..." /></div>
          <div className="nav-actions">
            <button onClick={() => document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" })}>♡ <span>Wishlist ({wishlist.length})</span></button>
            <button onClick={() => setAccountOpen(true)}>♙ <span>Account</span></button>
            <button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>🛒 <span>Cart ({cart.length})</span></button>
          </div>
        </div>
      </header>

      <nav className="category-nav">
        <div className="container category-links">
          <button onClick={() => chooseCategory("All")}>All Categories</button>
          {categories.slice(0, 6).map(([emoji, name]) => <button onClick={() => chooseCategory(name)} key={name}>{emoji} {name}</button>)}
          <button onClick={() => { setCategory("All"); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>Deals</button>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">WELCOME TO DEEPANSHI</p>
            <h1>Everything you need.<br /><em>All in one place.</em></h1>
            <p className="hero-text">Discover fashion, electronics, beauty, home essentials and more — with new products arriving every day.</p>
            <div className="hero-buttons"><button className="btn primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Shop Now →</button><button className="btn secondary" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Explore Categories</button></div>
            <div className="trust"><span>✓ Secure shopping</span><span>✓ Easy returns</span><span>✓ Great value</span></div>
          </div>
          <div className="hero-art"><div className="orbit one">🛍️</div><div className="orbit two">📱</div><div className="orbit three">👗</div><div className="hero-card"><div>✨</div><strong>One marketplace.<br />Countless possibilities.</strong><small>Shop your world</small></div></div>
        </div>
      </section>

      <section id="categories" className="section container">
        <div className="section-head"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Find what you love</h2></div><button className="link-button" onClick={() => chooseCategory("All")}>View all →</button></div>
        <div className="category-grid">{categories.map(([emoji, name, desc]) => <button className="category-card" onClick={() => chooseCategory(name)} key={name}><div className="category-icon">{emoji}</div><strong>{name}</strong><span>{desc}</span></button>)}</div>
      </section>

      <section id="products" className="section products-section">
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">TRENDING NOW</p><h2>{category === "All" ? "Popular picks" : category}</h2></div><button className="link-button" onClick={() => { setCategory("All"); setQuery(""); }}>See all products →</button></div>
          {filteredProducts.length === 0 ? <div className="empty">No products found. Try another search.</div> : <div className="product-grid">{filteredProducts.map((p) => <article className="product-card" key={p.name}><button className={`heart ${wishlist.includes(p.name) ? "active" : ""}`} aria-label={`Add ${p.name} to wishlist`} onClick={() => toggleWishlist(p.name)}>{wishlist.includes(p.name) ? "♥" : "♡"}</button><div className="product-image">{p.emoji}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><div><strong>{money(p.price)}</strong> <del>{money(p.old)}</del></div><button className="add-cart" onClick={() => addToCart(p.name)}>Add to Cart</button></div></article>)}</div>}
        </div>
      </section>

      <section id="wishlist" className="container mini-panel"><strong>Wishlist</strong><span>{wishlist.length ? wishlist.join(" • ") : "Your wishlist is empty."}</span></section>
      <section id="cart" className="container mini-panel"><strong>Cart</strong><span>{cart.length ? `${cart.length} item(s) • ${cart.join(" • ")}` : "Your cart is empty."}</span></section>

      <section className="promo"><div className="container promo-inner"><div><p className="eyebrow">NEW TO DEEPANSHI?</p><h2>Get 10% off your first order</h2><p>Sign up for offers, new arrivals and exclusive deals.</p></div><button className="btn primary" onClick={() => setAccountOpen(true)}>Create Account →</button></div></section>

      <footer><div className="container footer-grid"><div><button className="logo logo-button footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>DEEPANSHI<span>.</span></button><p>Your world of shopping, all in one place.</p></div><div><strong>Shop</strong><button onClick={() => chooseCategory("All")}>All Products</button><button onClick={() => chooseCategory("All")}>Deals</button><button onClick={() => chooseCategory("All")}>New Arrivals</button></div><div><strong>Help</strong><button onClick={() => notify("Contact support will be connected soon.")}>Contact Us</button><button onClick={() => notify("Shipping information will be connected soon.")}>Shipping</button><button onClick={() => notify("Returns information will be connected soon.")}>Returns</button></div><div><strong>Account</strong><button onClick={() => setAccountOpen(true)}>Sign In</button><button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>My Orders</button><button onClick={() => document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" })}>Wishlist</button></div></div><div className="container copyright">© 2026 DEEPANSHI. All rights reserved.</div></footer>

      {accountOpen && <div className="modal-backdrop" onClick={() => setAccountOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setAccountOpen(false)}>×</button><p className="eyebrow">DEEPANSHI ACCOUNT</p><h2>Sign in / Create account</h2><p>Account login will be connected to the secure database next.</p><button className="btn primary" onClick={() => { setAccountOpen(false); notify("Account feature is ready for the next setup step."); }}>Continue</button></div></div>}
    </main>
  );
}
