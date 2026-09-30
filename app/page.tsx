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
  image?: string;
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

const moreProducts: Product[] = [
  { id: "15", emoji: "👗", name: "Elegant Summer Dress", category: "Fashion", price: 1299, old: 2199, description: "Lightweight everyday dress with a comfortable fit.", stock: 35, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85" },
  { id: "16", emoji: "👔", name: "Premium Casual Shirt", category: "Fashion", price: 999, old: 1499, description: "Clean modern shirt for work and weekends.", stock: 44, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85" },
  { id: "17", emoji: "📱", name: "Smartphone Pro Case", category: "Electronics", price: 399, old: 699, description: "Slim protective case with premium finish.", stock: 90, image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85" },
  { id: "18", emoji: "⌨️", name: "Wireless Keyboard", category: "Electronics", price: 1499, old: 2299, description: "Minimal wireless keyboard for work and study.", stock: 32, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85" },
  { id: "19", emoji: "☕", name: "Ceramic Coffee Set", category: "Home & Kitchen", price: 799, old: 1199, description: "Elegant ceramic cups for everyday coffee.", stock: 52, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85" },
  { id: "20", emoji: "🛋️", name: "Cozy Home Cushion", category: "Home & Kitchen", price: 549, old: 899, description: "Soft textured cushion for a warm home.", stock: 75, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85" },
  { id: "21", emoji: "💄", name: "Beauty Makeup Kit", category: "Beauty", price: 1099, old: 1799, description: "Everyday makeup essentials in one kit.", stock: 41, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85" },
  { id: "22", emoji: "🧴", name: "Hydrating Face Care", category: "Beauty", price: 749, old: 1099, description: "Gentle daily hydration and skincare.", stock: 58, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85" },
  { id: "23", emoji: "🎒", name: "Travel Backpack", category: "Fashion", price: 1399, old: 2199, description: "Roomy backpack for travel, college and office.", stock: 39, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85" },
  { id: "24", emoji: "🏃", name: "Performance Sports Set", category: "Sports", price: 1199, old: 1899, description: "Comfortable activewear for everyday workouts.", stock: 48, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85" },
  { id: "25", emoji: "🧘", name: "Yoga Mat Pro", category: "Sports", price: 899, old: 1399, description: "Cushioned non-slip mat for yoga and fitness.", stock: 60, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=85" },
  { id: "26", emoji: "📚", name: "Mindful Living Book", category: "Books", price: 399, old: 599, description: "A thoughtful addition to your reading shelf.", stock: 70, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85" },
];

const extraProducts: Product[] = [
  { id: "7", emoji: "👕", name: "Classic Cotton T-Shirt", category: "Fashion", price: 599, old: 999, description: "Soft everyday cotton t-shirt.", stock: 70, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85" },
  { id: "8", emoji: "👟", name: "Urban Running Shoes", category: "Fashion", price: 1899, old: 2999, description: "Comfortable running shoes for daily movement.", stock: 45, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85" },
  { id: "9", emoji: "🎧", name: "Studio Wireless Headphones", category: "Electronics", price: 3499, old: 5999, description: "Immersive wireless audio with deep bass.", stock: 30, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85" },
  { id: "10", emoji: "⌚", name: "Minimal Smart Watch", category: "Electronics", price: 2799, old: 4499, description: "Smart tracking and notifications in a sleek design.", stock: 28, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85" },
  { id: "11", emoji: "👜", name: "Premium Leather Handbag", category: "Fashion", price: 1599, old: 2499, description: "Elegant everyday handbag with spacious storage.", stock: 38, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85" },
  { id: "12", emoji: "💡", name: "Modern Bedside Lamp", category: "Home & Kitchen", price: 1099, old: 1599, description: "Warm ambient lighting for your home.", stock: 55, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85" },
  { id: "13", emoji: "🧴", name: "Skincare Essentials Set", category: "Beauty", price: 899, old: 1299, description: "A simple daily skincare essentials collection.", stock: 65, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85" },
  { id: "14", emoji: "👓", name: "Everyday Sunglasses", category: "Fashion", price: 799, old: 1299, description: "Classic frame for everyday style.", stock: 42, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85" },
];

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
        setProducts([...liveProducts, ...extraProducts, ...moreProducts]);
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

  function productVisuals(p: Product): { bg: string; icon: string; label: string; image?: string }[] {
    return [
      { bg: "#f4e8e1", icon: p.emoji ?? "🛍️", label: "Front view", image: p.image },
      { bg: "#eee5df", icon: "✨", label: "Detail view", image: p.image },
      { bg: "#e9ddd5", icon: p.emoji ?? "🛍️", label: "Lifestyle view", image: p.image },
      { bg: "#f7eee9", icon: "📦", label: "Package view", image: p.image },
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
        {loading ? <div className="empty">Loading products from DEEPANSHI database...</div> : filteredProducts.length === 0 ? <div className="empty">No products found. Try another search.</div> : <div className="product-grid">{filteredProducts.map((p) => <article className="product-card" key={p.id} onClick={() => openProduct(p)}><button className={`heart ${wishlist.includes(p.id) ? "active" : ""}`} aria-label={`Add ${p.name} to wishlist`} onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id, p.name); }}>{wishlist.includes(p.id) ? "♥" : "♡"}</button><div className="product-image">{p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : p.emoji}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><div><strong>{money(p.price)}</strong> {p.old !== null && <del>{money(p.old)}</del>}</div><button className="add-cart" onClick={(e) => { e.stopPropagation(); addToCart(p.id, p.name); }}>Add to Cart</button></div></article>)}</div>}
      </div></section>
      <section className="deal-strip"><div className="container deal-grid">
        <div><span>⚡ FLASH SALE</span><strong>Up to 60% OFF</strong><small>Limited-time prices across popular categories</small></div>
        <div><span>🚚 FREE DELIVERY</span><strong>On orders above ₹499</strong><small>Fast delivery across India</small></div>
        <div><span>🔒 SAFE SHOPPING</span><strong>Secure checkout</strong><small>Your shopping experience matters</small></div>
        <div><span>↩ EASY RETURNS</span><strong>Simple returns</strong><small>Shop with confidence</small></div>
      </div></section>

      <section className="section container"><div className="section-head"><div><p className="eyebrow">LIMITED TIME</p><h2>Deals you'll want to grab</h2></div><button className="link-button" onClick={() => chooseCategory("All")}>Shop deals →</button></div>
        <div className="deal-banners">
          <button onClick={() => chooseCategory("Fashion")} className="deal-banner fashion-banner"><span>FASHION DAYS</span><strong>Fresh styles<br/>from ₹599</strong><small>Shop fashion →</small></button>
          <button onClick={() => chooseCategory("Electronics")} className="deal-banner tech-banner"><span>TECH PICKS</span><strong>Smart gadgets<br/>at great prices</strong><small>Explore electronics →</small></button>
          <button onClick={() => chooseCategory("Home & Kitchen")} className="deal-banner home-banner"><span>HOME EDIT</span><strong>Make your space<br/>feel special</strong><small>Shop home →</small></button>
        </div>
      </section>

      <section className="section editorial"><div className="container"><div className="editorial-grid">
        <div className="editorial-copy"><p className="eyebrow">THE DEEPANSHI EDIT</p><h2>Curated for your everyday life.</h2><p>From the things you wear to the things that make home feel like home, discover collections selected to make everyday shopping easier.</p><button className="btn primary" onClick={() => document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}>Explore the collection →</button></div>
        <div className="editorial-tiles"><div className="editor-tile tall"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85" alt="Fashion collection"/><span>STYLE</span></div><div className="editor-tile"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85" alt="Home collection"/><span>HOME</span></div><div className="editor-tile"><img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85" alt="Tech collection"/><span>TECH</span></div></div>
      </div></div></section>

      <section className="section container"><div className="section-head"><div><p className="eyebrow">SHOPPING, SIMPLIFIED</p><h2>Why shop with DEEPANSHI?</h2></div></div>
        <div className="benefit-grid"><div><b>01</b><h3>One place for everything</h3><p>Explore fashion, technology, beauty, home, sports and more without jumping between stores.</p></div><div><b>02</b><h3>Prices worth discovering</h3><p>Find everyday essentials, new arrivals and limited offers at prices made for smart shopping.</p></div><div><b>03</b><h3>Made for India</h3><p>Simple browsing, INR pricing, delivery information and a shopping experience designed around you.</p></div><div><b>04</b><h3>Always something new</h3><p>Fresh products and collections keep your next discovery just one click away.</p></div></div>
      </section>

      <section className="section brands-section"><div className="container"><p className="eyebrow">EXPLORE COLLECTIONS</p><h2>Popular shopping destinations</h2><div className="brand-row">{["TRENDY","URBAN","LUMINA","NOVA","EVERYDAY","MODERN HOME"].map((b)=><button key={b} onClick={()=>chooseCategory("All")}>{b}</button>)}</div></div></section>

      <section className="section container"><div className="section-head"><div><p className="eyebrow">CUSTOMER FAVOURITES</p><h2>More products to discover</h2></div><button className="link-button" onClick={()=>{setQuery("");setCategory("All");}}>View everything →</button></div>
        <div className="product-grid secondary-grid">{products.slice(8,16).map((p)=><article className="product-card" key={"discover-"+p.id} onClick={()=>openProduct(p)}><button className={`heart ${wishlist.includes(p.id) ? "active" : ""}`} aria-label="Wishlist" onClick={(e)=>{e.stopPropagation();toggleWishlist(p.id,p.name)}}>{wishlist.includes(p.id)?"♥":"♡"}</button><div className="product-image">{p.image?<img src={p.image} alt={p.name} loading="lazy"/>:p.emoji}</div><div className="product-info"><span className="product-category">{p.category}</span><h3>{p.name}</h3><div><strong>{money(p.price)}</strong>{p.old!==null&&<del>{money(p.old)}</del>}</div><button className="add-cart" onClick={(e)=>{e.stopPropagation();addToCart(p.id,p.name)}}>Add to Cart</button></div></article>)}</div>
      </section>

      <section className="reviews"><div className="container"><p className="eyebrow">FROM OUR SHOPPERS</p><h2>People love discovering DEEPANSHI</h2><div className="review-grid"><blockquote>“Beautifully simple to browse. I found fashion and home products in the same place.”<cite>— Aanya, Delhi</cite></blockquote><blockquote>“The product selection feels fresh and the prices are easy to compare.”<cite>— Rohan, Mumbai</cite></blockquote><blockquote>“I like that the site makes categories and deals easy to find.”<cite>— Priya, Jaipur</cite></blockquote></div></div></section>

      <section className="newsletter"><div className="container newsletter-inner"><div><p className="eyebrow">STAY IN THE LOOP</p><h2>Get the good stuff in your inbox.</h2><p>New arrivals, special offers and shopping inspiration — no clutter.</p></div><div className="newsletter-form"><input placeholder="Enter your email address"/><button className="btn primary" onClick={()=>notify("Thanks! Newsletter signup will be connected next.")}>Subscribe</button></div></div></section>

      <section id="wishlist" className="container mini-panel"><strong>Wishlist</strong><span>{wishlist.length ? `${wishlist.length} item(s)` : "Your wishlist is empty."}</span></section>
      <section id="cart" className="container mini-panel"><strong>Cart</strong><span>{cart.length ? `${cart.length} item(s)` : "Your cart is empty."}</span></section>
      <section className="promo"><div className="container promo-inner"><div><p className="eyebrow">NEW TO DEEPANSHI?</p><h2>Get 10% off your first order</h2><p>Sign up for offers, new arrivals and exclusive deals.</p></div><button className="btn primary" onClick={() => setAccountOpen(true)}>Create Account →</button></div></section>
      <footer><div className="container footer-grid"><div><button className="logo logo-button footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>DEEPANSHI<span>.</span></button><p>Your world of shopping, all in one place.</p></div><div><strong>Shop</strong><button onClick={() => chooseCategory("All")}>All Products</button><button onClick={() => chooseCategory("All")}>Deals</button><button onClick={() => chooseCategory("All")}>New Arrivals</button></div><div><strong>Help</strong><button onClick={() => notify("Contact support will be connected soon.")}>Contact Us</button><button onClick={() => notify("Shipping information will be connected soon.")}>Shipping</button><button onClick={() => notify("Returns information will be connected soon.")}>Returns</button></div><div><strong>Account</strong><button onClick={() => setAccountOpen(true)}>Sign In</button><button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>My Orders</button><button onClick={() => document.getElementById("wishlist")?.scrollIntoView({ behavior: "smooth" })}>Wishlist</button></div></div><div className="container copyright">© 2026 DEEPANSHI. All rights reserved.</div></footer>
      {selectedProduct && <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
          <div className="gallery">
            <div className="thumbs">
              {productVisuals(selectedProduct).map((v, i) => <button className={i === activeImage ? "thumb active" : "thumb"} key={i} onClick={() => setActiveImage(i)} style={{ background: v.bg }}>{v.image ? <img src={v.image} alt={v.label} /> : v.icon}</button>)}
            </div>
            <div className="main-visual" style={{ background: productVisuals(selectedProduct)[activeImage].bg }}>
              {productVisuals(selectedProduct)[activeImage].image ? <img src={productVisuals(selectedProduct)[activeImage].image} alt={productVisuals(selectedProduct)[activeImage].label} /> : <span>{productVisuals(selectedProduct)[activeImage].icon}</span>}
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
