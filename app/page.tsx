"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  old: number | null;
  emoji: string | null;
  stock: number;
};

const fallbackCategories: Category[] = [
  { id: "fashion", name: "Fashion", description: "Clothing, shoes & accessories", emoji: "👗" },
  { id: "electronics", name: "Electronics", description: "Phones, gadgets & accessories", emoji: "📱" },
  { id: "beauty", name: "Beauty", description: "Beauty & personal care", emoji: "💄" },
  { id: "home", name: "Home & Kitchen", description: "Everything for your home", emoji: "🏠" },
  { id: "kids", name: "Kids & Toys", description: "Fun for every age", emoji: "🧸" },
  { id: "jewellery", name: "Jewellery", description: "Jewellery & accessories", emoji: "💍" },
  { id: "books", name: "Books", description: "Books & learning", emoji: "📚" },
  { id: "sports", name: "Sports", description: "Fitness & outdoor", emoji: "🏋️" },
];

const fallbackProducts: Product[] = [
  { id: "1", emoji: "👟", name: "Everyday Comfort Sneakers", category: "Fashion", price: 1499, old: 2499, description: null, stock: 50 },
  { id: "2", emoji: "🎧", name: "Wireless Pro Headphones", category: "Electronics", price: 2999, old: 4999, description: null, stock: 35 },
  { id: "3", emoji: "👜", name: "Classic Everyday Handbag", category: "Fashion", price: 1199, old: 1999, description: null, stock: 40 },
  { id: "4", emoji: "⌚", name: "Smart Fitness Watch", category: "Electronics", price: 2499, old: 3999, description: null, stock: 25 },
  { id: "5", emoji: "💡", name: "Modern Table Lamp", category: "Home & Kitchen", price: 899, old: 1299, description: null, stock: 60 },
  { id: "6", emoji: "🧴", name: "Daily Care Essentials", category: "Beauty", price: 699, old: 999, description: null, stock: 80 },
];

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function Home() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function loadStore() {
      const [categoryResult, productResult] = await Promise.all([
        supabase.from("categories").select("id,name,description,emoji").order("name"),
        supabase.from("products").select("id,name,description,price,old_price,emoji,stock,categories(name)").eq("is_active", true).order("created_at", { ascending: false }),
      ]);

      if (!categoryResult.error && categoryResult.data?.length) setCategories(categoryResult.data as Category[]);

      if (!productResult.error && productResult.data?.length) {
        const liveProducts: Product[] = productResult.data.map((p: any) => ({
          id: p.id, name: p.name, description: p.description ?? null, category: p.categories?.name ?? "Other",
          price: Number(p.price), old: p.old_price === null ? null : Number(p.old_price), emoji: p.emoji ?? "🛍️", stock: Number(p.stock ?? 0),
        }));
        setProducts(liveProducts);
      }

      setLoading(false);
      if (categoryResult.error || productResult.error) {
        console.error("Supabase store loading error:", categoryResult.error ?? productResult.error);
        setMessage("Live database could not be loaded. Showing available products.");
        window.setTimeout(() => setMessage(""), 3000);
      }
    }
    loadStore();
  }, []);

  const filteredProducts = useMemo(() => products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const q = query.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [products, query, category]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2200);
  }

  function addToCart(id: string, name: string) {
    setCart((items) => [...items, id]);
    notify(`${name} added to cart`);
  }

  function toggleWishlist(id: string, name: string) {
    setWishlist((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
    notify(wishlist.includes(id) ? "Removed from wishlist" : `${name} added to wishlist`);
  }

  function productVisuals(p: Product) {
    return [
      { bg: "#f4e8e1", icon: p.emoji ?? "🛍️", label: "Front view" },
      { bg: "#eee5df", icon: "✨", label: "Detail view" },
      { bg: "#e9ddd5", icon: p.emoji ?? "🛍️", label: "Lifestyle view" },
      { bg: "#f7eee9", icon: "📦", label: "Package view" },
    ];
  }

  function openProduct(p: Product) {
    setSelectedProduct(p);
    setActiveImage(0);
  }

  function chooseCategory(name: string) {
    setCategory(name);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      {message && <div className="toast">{message}</div>}
      <header className="topbar"><div className="container nav">
        <button className="logo logo-button" onClick={() => { setCategory("All"); setQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>DEEPANSHI<span>.</span></button>
        <div className="search"><span>⌕</span><input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for products, brands and more..." /></div>
        <div className="nav-actions">
          <button onClick={() => document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" })}>♡ <span>Wishlist ({wishlist.length})</span></button>
          <button onClick={() => setAccountOpen(true)}>♙ <span>Account</span></button>
          <button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>🛒 <span>Cart ({cart.length})</span></button>
        </div>
      </div></header>
      <nav className="category-nav"><div className="container category-links">
        <button onClick={() => chooseCategory("All")}>All Categories</button>
        {categories.slice(0, 6).map((c) => <button onClick={() => chooseCategory(c.name)} key={c.id}>{c.emoji} {c.name}</button>)}
        <button onClick={() => { setCategory("All"); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>Deals</button>
      </div></nav>
      <section className="hero"><div className="container hero-inner">
        <div className="hero-copy"><p className="eyebrow">WELCOME TO DEEPANSHI</p><h1>Everything you need.<br /><em>All in one place.</em></h1><p className="hero-text">Discover fashion, electronics, beauty, home essentials and more — with new products arriving every day.</p>
          <div className="hero-buttons"><button className="btn primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Shop Now →</button><button className="btn secondary" onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Explore Categories</button></div>
          <div className="trust"><span>✓ Secure shopping</span><span>✓ Easy returns</span><span>✓ Great value</span></div>
        </div>
        <div className="hero-art"><div className="orbit one">🛍️</div><div className="orbit two">📱</div><div className="orbit three">👗</div><div className="hero-card"><div>✨</div><strong>One marketplace.<br />Countless possibilities.</strong><small>Shop your world</small></div></div>
      </div></section>
      <section id="categories" className="section container"><div className="section-head"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Find what you love</h2></div><button className="link-button" onClick={() => chooseCategory("All")}>View all →</button></div>
        <div className="category-grid">{categories.map((c) => <button className="category-card" onClick={() => chooseCategory(c.name)} key={c.id}><div className="category-icon">{c.emoji}</div><strong>{c.name}</strong><span>{c.description}</span></button>)}</div>
      </section>
      <section id="products" className="section products-section"><div className="container">
        <div className="section-head"><div><p className="eyebrow">TRENDING NOW</p><h2>{category === "All" ? "Popular picks" : category}</h2></div><button className="link-button" onClick={() => { setCategory("All"); setQuery(""); }}>See all products →</button></div>
        {loading ? <div className="empty">Loading products from DEEPANSHI database...</div> : filteredProducts.length === 0 ? <div className="empty">No products found. Try another search.</div> : <div className="product-grid">{filteredProducts.map((p) => <article className="product-card" key={p.id} onClick={() => openProduct(p)}><button className={`heart ${wishlist.includes(p.id) ? "active" : ""}`} aria-label={`Add ${p.name} to wishlist`} onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id, p.name); }}>{wishlist.includes(p.id) ? "♥" : "♡"}</button><div className="product-image">{p.emoji}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><div><strong>{money(p.price)}</strong> {p.old !== null && <del>{money(p.old)}</del>}</div><button className="add-cart" onClick={(e) => { e.stopPropagation(); addToCart(p.id, p.name); }}>Add to Cart</button></div></article>)}</div>}
      </div></section>
      <section id="wishlist" className="container mini-panel"><strong>Wishlist</strong><span>{wishlist.length ? `${wishlist.length} item(s)` : "Your wishlist is empty."}</span></section>
      <section id="cart" className="container mini-panel"><strong>Cart</strong><span>{cart.length ? `${cart.length} item(s)` : "Your cart is empty."}</span></section>
      <section className="promo"><div className="container promo-inner"><div><p className="eyebrow">NEW TO DEEPANSHI?</p><h2>Get 10% off your first order</h2><p>Sign up for offers, new arrivals and exclusive deals.</p></div><button className="btn primary" onClick={() => setAccountOpen(true)}>Create Account →</button></div></section>
      <footer><div className="container footer-grid"><div><button className="logo logo-button footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>DEEPANSHI<span>.</span></button><p>Your world of shopping, all in one place.</p></div><div><strong>Shop</strong><button onClick={() => chooseCategory("All")}>All Products</button><button onClick={() => chooseCategory("All")}>Deals</button><button onClick={() => chooseCategory("All")}>New Arrivals</button></div><div><strong>Help</strong><button onClick={() => notify("Contact support will be connected soon.")}>Contact Us</button><button onClick={() => notify("Shipping information will be connected soon.")}>Shipping</button><button onClick={() => notify("Returns information will be connected soon.")}>Returns</button></div><div><strong>Account</strong><button onClick={() => setAccountOpen(true)}>Sign In</button><button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>My Orders</button><button onClick={() => document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" })}>Wishlist</button></div></div><div className="container copyright">© 2026 DEEPANSHI. All rights reserved.</div></footer>
      {selectedProduct && <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
          <div className="gallery">
            <div className="thumbs">
              {productVisuals(selectedProduct).map((v, i) => <button className={i === activeImage ? "thumb active" : "thumb"} key={i} onClick={() => setActiveImage(i)} style={{ background: v.bg }}>{v.icon}</button>)}
            </div>
            <div className="main-visual" style={{ background: productVisuals(selectedProduct)[activeImage].bg }}>
              <span>{productVisuals(selectedProduct)[activeImage].icon}</span>
              <small>{productVisuals(selectedProduct)[activeImage].label}</small>
            </div>
          </div>
          <div className="product-modal-info">
            <span className="product-category">{selectedProduct.category}</span>
            <h2>{selectedProduct.name}</h2>
            <div className="rating">★★★★★ <span>4.8 (120 reviews)</span></div>
            <div className="modal-price"><strong>{money(selectedProduct.price)}</strong>{selectedProduct.old !== null && <del>{money(selectedProduct.old)}</del>}<b>{selectedProduct.old ? Math.round((1 - selectedProduct.price / selectedProduct.old) * 100) : 0}% OFF</b></div>
            <p>{selectedProduct.description || "Premium quality product from DEEPANSHI. Carefully selected for everyday use, great value and a smooth shopping experience."}</p>
            <div className="delivery-box"><strong>🚚 Free delivery</strong><span>Delivery available across India</span><span>✓ Secure payments & easy returns</span></div>
            <div className="modal-actions">
              <button className="btn primary" onClick={() => { addToCart(selectedProduct.id, selectedProduct.name); setSelectedProduct(null); }}>Add to Cart</button>
              <button className="btn secondary" onClick={() => toggleWishlist(selectedProduct.id, selectedProduct.name)}>♡ Wishlist</button>
            </div>
          </div>
        </div>
      </div>}
      {accountOpen && <div className="modal-backdrop" onClick={() => setAccountOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setAccountOpen(false)}>×</button><p className="eyebrow">DEEPANSHI ACCOUNT</p><h2>Sign in / Create account</h2><p>Account login will be connected to the secure database next.</p><button className="btn primary" onClick={() => { setAccountOpen(false); notify("Account feature is ready for the next setup step."); }}>Continue</button></div></div>}
    </main>
  );
}
