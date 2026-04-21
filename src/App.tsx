import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, type Language } from './translations';
import { cn } from './lib/utils';
import { Menu, X, ArrowRight, Instagram, Mail, Globe, Plus, Minus, Layers, Move } from 'lucide-react';

import { ShoppingBag, ChevronLeft, Trash2, CreditCard, Upload, Image as ImageIcon, Maximize2 } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'collection' | 'about' | 'contact' | 'product' | 'cart' | 'checkout'>('home');
  const [cart, setCart] = useState<{ id: string, title: string, price: string, num: string, size: string, image: string, customization: any[] }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const t = translations[lang];

  // Smooth scroll and page reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const addToCart = (product: any, size: string, customization: any[] = []) => {
    setCart([...cart, { ...product, size, customization, id: `${product.id}-${Date.now()}` }]);
    setCurrentPage('cart');
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero t={t.hero} />
            <FeaturedCollection t={t.collection} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} />
            <Philosophy t={t.philosophy} />
            <CustomStudio t={t.custom} onInitialize={() => setCurrentPage('collection')} />
          </>
        );
      case 'collection':
        return <FullCollection t={t.collection} onProductClick={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} />;
      case 'about':
        return <PhilosophyPage t={t.philosophy} />;
      case 'contact':
        return <ContactPage t={t.contact} />;
      case 'product':
        return <ProductDetail t={t} product={selectedProduct} onAddToCart={addToCart} onBack={() => setCurrentPage('collection')} />;
      case 'cart':
        return <Cart t={t} cart={cart} onRemove={removeFromCart} onCheckout={() => setCurrentPage('checkout')} onBack={() => setCurrentPage('collection')} />;
      case 'checkout':
        return <Checkout t={t.checkout} cart={cart} onBack={() => setCurrentPage('cart')} />;
      default:
        return <Hero t={t.hero} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-ink font-sans antialiased overflow-x-hidden">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#F0EEEA]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[#7A8C86]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-pattern" />
      </div>

      <Navbar 
        t={t.nav} 
        lang={lang} 
        setLang={setLang} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        cartCount={cart.length}
      />
      
      <main className="relative z-10 pt-24 md:pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer t={t.footer} setCurrentPage={setCurrentPage} />

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        t={t.nav} 
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function Navbar({ 
  t, 
  lang, 
  setLang, 
  isMenuOpen, 
  setIsMenuOpen,
  setCurrentPage,
  currentPage,
  cartCount
}: { 
  t: any, 
  lang: Language, 
  setLang: (l: Language) => void, 
  isMenuOpen: boolean, 
  setIsMenuOpen: (v: boolean) => void,
  setCurrentPage: (p: any) => void,
  currentPage: string,
  cartCount: number
}) {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference text-white">
      <div className="flex flex-col gap-0.5 cursor-pointer group" onClick={() => setCurrentPage('home')}>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold tracking-[-0.05em] uppercase leading-none"
        >
          NEOVORA
        </motion.span>
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-mono tracking-[0.3em] uppercase opacity-60">Atelier 26</span>
           <div className="h-[1px] w-4 bg-white/20 group-hover:w-8 transition-all" />
        </div>
      </div>

      <div className="hidden lg:flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold">
        <button onClick={() => setCurrentPage('collection')} className={cn("hover:opacity-100 transition-opacity", currentPage === 'collection' ? "opacity-100" : "opacity-40")}>{t.collection}</button>
        <button onClick={() => setCurrentPage('collection')} className="opacity-40 hover:opacity-100 transition-opacity">{t.custom}</button>
        <button onClick={() => setCurrentPage('about')} className={cn("hover:opacity-100 transition-opacity", currentPage === 'about' ? "opacity-100" : "opacity-40")}>{t.about}</button>
        <button onClick={() => setCurrentPage('contact')} className={cn("hover:opacity-100 transition-opacity", currentPage === 'contact' ? "opacity-100" : "opacity-40")}>{t.contact}</button>
      </div>

      <div className="flex gap-8 items-center">
        <div className="hidden md:flex gap-4 text-[9px] font-mono tracking-tighter items-center mr-4">
          {(['fr', 'en', 'zh'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "transition-all duration-300 uppercase",
                lang === l ? "opacity-100 underline underline-offset-4" : "opacity-30 hover:opacity-100"
              )}
            >
              [{l}]
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage('cart')}
          className="relative group mr-2"
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent text-brand-bg text-[8px] flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

function Hero({ t }: { t: any }) {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden -mt-24 md:-mt-32">
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2574&auto=format&fit=crop" 
          className="w-full h-full object-cover grayscale opacity-20 brightness-50"
          alt="Street Background"
        />
      </div>

      <div className="flex flex-col mb-4 overflow-hidden max-w-4xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
           <span className="tech-label text-brand-accent border-brand-accent/30 font-bold">Drop 01 / Street Elevation</span>
           <div className="h-[1px] flex-grow bg-brand-ink/10" />
        </motion.div>

        <h1 className="text-huge font-bold tracking-tighter leading-none mb-12 uppercase">
          <motion.div 
             initial={{ x: -100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.title.split('\n')[0]}
          </motion.div>
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-brand-accent ml-[10vw]"
          >
            {t.title.split('\n')[1] || "Evolution"}
          </motion.div>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="md:col-span-4 space-y-8"
        >
          <p className="text-[13px] leading-relaxed tracking-wider font-light text-brand-muted max-w-sm">
            {t.subtitle}
          </p>
          <div className="flex gap-4">
             <span className="text-[9px] font-mono opacity-40 uppercase">Paris Design</span>
             <span className="text-[9px] font-mono opacity-40 uppercase">Global Scale</span>
          </div>
        </motion.div>

        <div className="md:col-span-8 flex justify-end">
          <motion.button 
            onClick={() => {}}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 px-10 py-6 bg-brand-ink text-brand-bg rounded-none group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-[11px] uppercase tracking-[0.4em] font-black">{t.cta}</span>
            <ArrowRight size={20} className="relative z-10" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollection({ t, onProductClick }: { t: any, onProductClick: (p: any) => void }) {
  const products = [
    { id: 1, title: "Oversized Heavy Cotton Tee", num: "NV-001", price: "€95", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop" },
    { id: 2, title: "Engineered Utility Hoodie", num: "NV-004", price: "€220", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop" },
    { id: 3, title: "Technical Cargo Trouser", num: "NV-007", price: "€180", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" }
  ];

  return (
    <section id="collection" className="py-48 px-6 md:px-12 lg:px-24">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-baseline mb-32 gap-16">
          <div className="space-y-6 flex-grow">
            <div className="flex items-center gap-4">
              <span className="tech-label text-brand-accent border-brand-accent/30">01 / The Drop</span>
              <div className="h-[1px] w-24 bg-brand-ink/10"></div>
            </div>
            <h2 className="text-7xl md:text-[8vw] tracking-tighter leading-none font-bold uppercase">{t.title}</h2>
          </div>
          <p className="max-w-xs text-[11px] text-brand-muted tracking-[0.2em] uppercase leading-relaxed font-bold border-l-2 border-brand-accent pl-8 py-2">
             {t.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {products.map((p, i) => (
            <CollectionCard 
              key={p.id}
              {...p}
              onClick={() => onProductClick(p)}
              className={cn(i % 2 !== 0 && "lg:mt-32")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy({ t }: { t: any }) {
  return (
    <section className="py-64 px-6 md:px-12 lg:px-24 bg-brand-stone/10 relative overflow-hidden border-y border-brand-ink/5">
      <div className="absolute inset-0 opacity-[0.02] bg-pattern" />
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-24 items-center relative z-10">
         <div className="w-full md:w-1/2 space-y-12">
            <div className="flex items-center gap-4">
               <span className="tech-label text-brand-accent border-brand-accent/30 font-bold">Concept</span>
               <div className="h-[1px] w-12 bg-brand-ink/10" />
            </div>
            <h2 className="text-7xl lg:text-[8rem] tracking-tighter leading-none font-bold uppercase">{t.title}</h2>
            <p className="text-xl lg:text-3xl font-light italic leading-relaxed text-brand-muted text-balance border-l border-brand-accent/30 pl-8">
              "{t.concept}"
            </p>
         </div>
         <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[3/4] bg-brand-stone overflow-hidden border-technical">
               <img 
                 src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2640&auto=format&fit=crop" 
                 className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0 hover:scale-105"
                 alt="Brand scene"
               />
               <div className="absolute bottom-6 left-6">
                  <span className="tech-label bg-brand-ink text-brand-bg border-none">Paris Atelier 2026</span>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}

function CollectionCard({ title, num, image, onClick, className }: { title: string, num: string, image: string, onClick?: () => void, className?: string, key?: any }) {
  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={cn("group cursor-pointer space-y-8", className)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-brand-stone/20 border-technical group-hover:border-brand-ink/30 transition-all duration-700">
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute top-6 right-6">
           <span className="tech-label bg-white/80 backdrop-blur-sm backdrop-saturate-200">Limited Edition</span>
        </div>
      </div>
      <div className="flex justify-between items-end pb-8 group-hover:px-2 transition-all duration-500">
        <div className="space-y-2">
          <span className="text-[10px] font-mono opacity-40 block tracking-[0.3em] font-bold uppercase">{num}</span>
          <h3 className="text-3xl md:text-5xl tracking-tighter uppercase font-bold">{title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="w-12 h-12 rounded-none border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-ink group-hover:text-brand-bg transition-all duration-500">
             <ArrowRight size={20} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomStudio({ t, onInitialize }: { t: any, onInitialize: () => void }) {
  return (
    <section id="custom" className="py-64 px-6 md:px-12 lg:px-24 bg-brand-ink text-brand-bg relative overflow-hidden">
      {/* Texture bg */}
      <div className="absolute inset-0 opacity-[0.05] bg-pattern pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-40 relative z-10">
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square max-w-lg mx-auto">
             <div className="absolute inset-0 border border-brand-bg/5 rounded-full animate-spin-slow p-16">
                <div className="w-full h-full border border-dashed border-brand-bg/10 rounded-full" />
             </div>
             <div className="relative w-full h-full mask-oval p-10 bg-brand-ink/40 border border-brand-bg/10 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2274&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-30 hover:opacity-100 transition-opacity duration-1000 grayscale"
                  alt="Custom atelier"
                />
             </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-16">
          <div className="space-y-10">
            <span className="text-[12px] uppercase tracking-[0.8em] text-brand-bg opacity-40 font-bold block">Engineered</span>
            <h2 className="text-7xl md:text-8xl lg:text-[10rem] leading-none font-bold tracking-tighter uppercase">
              {t.title}
            </h2>
            <p className="max-w-md text-[16px] leading-relaxed tracking-[0.1em] text-brand-bg opacity-50 font-light underline decoration-brand-bg/20 underline-offset-8">
              {t.description}
            </p>
          </div>

          <button onClick={onInitialize} className="flex items-center gap-10 group">
            <div className="w-24 h-24 rounded-none border border-brand-bg/20 group-hover:border-brand-bg/80 flex items-center justify-center transition-all duration-1000 bg-brand-bg/5">
               <ArrowRight size={32} strokeWidth={1} className="group-hover:translate-x-2 transition-transform" />
            </div>
            <span className="text-[12px] uppercase tracking-[0.6em] font-bold group-hover:tracking-[0.8em] transition-all duration-700">{t.cta}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function FullCollection({ t, onProductClick }: { t: any, onProductClick: (p: any) => void }) {
   const products = Array.from({ length: 6 }).map((_, i) => ({
      id: i + 1,
      title: ["Classic Boxy Tee", "Heavyweight Hoodie", "Nylon Cargo Pant", "Panel Beanie", "Layering Vest", "Canvas Tote"][i],
      num: `NV-00${i+1}`,
      price: ["€95", "€220", "€180", "€65", "€260", "€45"][i],
      image: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576871337622-98442213d75c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591047139829-d91aec16adbb?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
      ][i]
   }));

  return (
    <div className="py-24 px-6 md:px-12 lg:px-24">
      <header className="mb-24 space-y-8">
        <h2 className="text-7xl md:text-[10vw] font-bold tracking-tighter leading-none uppercase">{t.title}</h2>
        <div className="flex items-center gap-8">
           <div className="h-[1px] w-24 bg-brand-ink" />
           <p className="text-[13px] font-mono opacity-40 uppercase">{t.description}</p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
        {products.map((p) => (
          <CollectionCard 
            key={p.id}
            {...p}
            onClick={() => onProductClick(p)}
          />
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ t, product, onAddToCart, onBack }: { t: any, product: any, onAddToCart: (p: any, s: string, customization?: any[]) => void, onBack: () => void }) {
  const [size, setSize] = useState<string>('M');
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [points, setPoints] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const archiveAssets = [
    { id: 'A1', label: 'NEOVORA_LOGO', type: 'image', value: 'NEOVORA' },
    { id: 'A2', label: 'TECH_SYM', type: 'image', value: '∑' },
    { id: 'A3', label: ' PARIS_COORD', type: 'text', value: '48.8566° N, 2.3522° E' },
    { id: 'A4', label: 'MANIFESTO_EX', type: 'text', value: 'SILENCE IS LOUD' }
  ];

  if (!product) return null;

  const addPoint = () => {
    if (points.length >= 5) return;
    const newPoint = {
      id: Date.now(),
      side,
      type: 'text',
      value: 'SIGNATURE',
      size: 100,
      x: 50,
      y: 50
    };
    setPoints([...points, newPoint]);
    setSelectedPoint(points.length);
  };

  const updatePoint = (id: number, updates: any) => {
    setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    e.stopPropagation();
    setSelectedPoint(idx);
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || selectedPoint === null) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    updatePoint(points[selectedPoint].id, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const currentPrice = parseInt(product.price.replace('€', '')) + (Math.max(0, points.length - 2) * 15);

  return (
    <div className="py-12 px-6 md:px-12 lg:px-24 mb-32">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-16 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {t.shop.back}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
        {/* Left: Interactive Preview */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex justify-between items-center bg-brand-stone/5 p-4 border-technical">
              <span className="text-[9px] font-mono tracking-widest opacity-40 uppercase">Interactive Mockup Studio</span>
              <div className="flex gap-2">
                 <button onClick={() => setSide('front')} className={cn("px-4 py-1 text-[9px] uppercase font-bold border border-brand-ink/10 transition-all", side === 'front' ? "bg-brand-ink text-brand-bg" : "opacity-40")}>{t.studio.viewFront}</button>
                 <button onClick={() => setSide('back')} className={cn("px-4 py-1 text-[9px] uppercase font-bold border border-brand-ink/10 transition-all", side === 'back' ? "bg-brand-ink text-brand-bg" : "opacity-40")}>{t.studio.viewBack}</button>
              </div>
           </div>
           
           <div 
             className="aspect-[4/5] bg-brand-stone/10 border-technical relative overflow-hidden group select-none touch-none"
             onPointerMove={handlePointerMove}
             onPointerUp={() => setIsDragging(false)}
             onPointerLeave={() => setIsDragging(false)}
           >
              <img src={product.image} className={cn("w-full h-full object-cover grayscale transition-opacity duration-700", side === 'back' && "opacity-60 scale-x-[-1]")} alt={product.title} />
              <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none" />

              {/* Custom Layers */}
              {points.map((p, idx) => (
                p.side === side && (
                  <motion.div
                    key={p.id}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 cursor-move group/layer",
                      selectedPoint === idx ? "z-30 ring-1 ring-brand-accent ring-offset-4 ring-offset-transparent" : "z-20"
                    )}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    onPointerDown={(e) => handlePointerDown(e, idx)}
                  >
                    <div className="relative group/content">
                       <span className="text-brand-ink font-bold mix-blend-difference uppercase whitespace-nowrap leading-none transition-all block" style={{ fontSize: `${p.size / 8}px` }}>
                          {p.value}
                       </span>
                       {selectedPoint === idx && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4 bg-brand-accent px-3 py-1 rounded-full shadow-2xl scale-75 md:scale-100">
                             <Move size={12} className="text-brand-bg opacity-40" />
                             <span className="text-[10px] font-bold text-brand-bg">{Math.round(p.x)}% / {Math.round(p.y)}%</span>
                          </div>
                       )}
                    </div>
                  </motion.div>
                )
              ))}

            {/* Specs View Toggle */}
            <div className="absolute bottom-8 right-8 flex gap-4 z-40">
               <button 
                 onClick={() => setShowGrid(!showGrid)} 
                 className={cn(
                   "tech-label transition-all bg-white/60 backdrop-blur-md px-4 py-2 border",
                   showGrid ? "border-brand-accent text-brand-accent" : "border-brand-ink/10 opacity-0 group-hover:opacity-100"
                 )}
               >
                  {showGrid ? 'GRID_PROTOCOL: ACTIVE' : 'GRID_PROTOCOL: IDLE'}
               </button>
            </div>

            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-12 grid-rows-12 border border-brand-accent/20">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-brand-accent/5" />
                ))}
              </div>
            )}
           
           <p className="text-[10px] font-mono opacity-20 uppercase tracking-[0.3em] text-center italic mt-4 italic">
             Drag to position / Toggle view to customize both sides
           </p>
        </div>
      </div>

        {/* Right: Customization Controls & Purchase */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <span className="tech-label text-brand-accent border-brand-accent/30">{product.num} / Studio Ready</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">{product.title}</h1>
            <div className="flex items-baseline gap-4">
               <span className="text-3xl font-black tracking-tighter">€{currentPrice}.00</span>
               {points.length > 2 && <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest">(+€{Math.max(0, points.length - 2) * 15} DESIGN FEE)</span>}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
               <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">{t.shop.size}</span>
               <div className="flex flex-wrap gap-4">
                 {sizes.map((s) => (
                   <button 
                     key={s} 
                     onClick={() => setSize(s)}
                     className={cn(
                       "w-12 h-12 flex items-center justify-center border-technical text-[11px] font-bold transition-all",
                       size === s ? "bg-brand-ink text-brand-bg border-brand-ink" : "hover:border-brand-ink/40"
                     )}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>

            {/* Customization Console */}
            <div className="p-8 border-technical bg-brand-ink text-brand-bg space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03] bg-pattern pointer-events-none" />
               
               <div className="flex justify-between items-baseline relative z-10">
                  <div className="space-y-1">
                     <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t.studio.layers} ({points.length}/5)</span>
                     <p className="text-[8px] font-mono opacity-40 uppercase">Production Protocol ACTIVE</p>
                  </div>
                  <p className="text-[9px] font-mono text-brand-accent uppercase">{t.studio.pricingInfo}</p>
               </div>

               <div className="space-y-2 relative z-10">
                  {points.map((p, i) => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedPoint(i)}
                      className={cn(
                        "flex justify-between items-center p-4 border transition-all cursor-pointer", 
                        selectedPoint === i ? "bg-brand-bg text-brand-ink border-brand-accent ring-1 ring-brand-accent ring-offset-2 ring-offset-brand-ink" : "border-white/10 opacity-60 hover:opacity-100"
                      )}
                    >
                       <div className="flex items-center gap-4">
                          <div className={cn("w-6 h-6 flex items-center justify-center text-[9px] font-black border", selectedPoint === i ? "border-brand-ink" : "border-white/20")}>
                            0{i+1}
                          </div>
                          <div className="space-y-0.5">
                             <span className="text-[10px] font-black uppercase leading-none block">{p.side} / {p.value.slice(0, 12)}{p.value.length > 12 && '...'}</span>
                             <span className="text-[8px] font-mono opacity-40 block tracking-widest">{p.x.toFixed(0)}X / {p.y.toFixed(0)}Y / {p.size}%</span>
                          </div>
                       </div>
                       <button onClick={(e) => { e.stopPropagation(); setPoints(points.filter((_, idx) => idx !== i)); setSelectedPoint(null); }} className="hover:text-brand-accent"><X size={14} /></button>
                    </div>
                  ))}
                  
                  {points.length < 5 && (
                    <button 
                      onClick={addPoint}
                      className="w-full py-4 border-2 border-dashed border-white/10 text-[9px] font-black uppercase tracking-[0.6em] hover:border-brand-accent hover:text-brand-accent transition-all text-white/40"
                    >
                       + {t.studio.addPoint}
                    </button>
                  )}
               </div>

               {selectedPoint !== null && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pt-8 border-t border-white/10 relative z-10">
                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Asset Content</span>
                          <span className="text-[8px] font-mono opacity-20">ID: {points[selectedPoint].id.toString().slice(-4)}</span>
                       </div>
                       <input 
                         type="text" 
                         value={points[selectedPoint].value}
                         onChange={(e) => updatePoint(points[selectedPoint].id, { value: e.target.value.toUpperCase() })}
                         className="w-full bg-transparent border-b border-white/20 py-3 font-bold tracking-tighter text-2xl outline-none focus:border-brand-accent transition-all"
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Dimension</span>
                          <div className="flex items-center gap-4">
                             <input 
                               type="range" min="40" max="400" 
                               value={points[selectedPoint].size}
                               onChange={(e) => updatePoint(points[selectedPoint].id, { size: parseInt(e.target.value) })}
                               className="flex-grow h-1 bg-white/10 appearance-none accent-brand-accent"
                             />
                          </div>
                       </div>
                       <div className="space-y-4">
                           <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Presets</span>
                           <div className="flex flex-wrap gap-2">
                             {archiveAssets.map(asset => (
                               <button 
                                 key={asset.id} 
                                 onClick={() => updatePoint(points[selectedPoint].id, { value: asset.value })}
                                 className="text-[8px] font-black border border-white/10 px-3 py-1 hover:border-brand-accent hover:text-brand-accent transition-all uppercase"
                               >
                                  {asset.label.split('_')[1] || asset.label}
                               </button>
                             ))}
                           </div>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] font-mono opacity-40 p-4 border border-white/5 bg-white/5">
                        <span>TRANSMISSION_PROTOCOL: AES-256</span>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                           READY_FOR_PRINT
                        </div>
                    </div>
                 </motion.div>
               )}
            </div>

            <button 
              onClick={() => onAddToCart(product, size, points)}
              className="w-full py-8 bg-brand-ink text-brand-bg font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-accent transition-colors flex items-center justify-center gap-4"
            >
              <ShoppingBag size={18} />
              {t.shop.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart({ t, cart, onRemove, onCheckout, onBack }: { t: any, cart: any[], onRemove: (i: number) => void, onCheckout: () => void, onBack: () => void }) {
  const calculateItemTotal = (item: any) => {
    const basePrice = parseInt(item.price.replace('€', ''));
    const customizationSpots = item.customization?.length || 0;
    const additionalCost = Math.max(0, customizationSpots - 2) * 15;
    return basePrice + additionalCost;
  };

  const total = cart.reduce((acc: number, item: any) => acc + calculateItemTotal(item), 0);

  return (
    <div className="py-12 px-6 md:px-12 lg:px-24 min-h-[60vh]">
      <header className="mb-24 flex justify-between items-baseline border-b border-brand-ink/10 pb-8">
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase">{t.nav.cart}</h2>
        <span className="text-[11px] font-mono opacity-40">[{cart.length} Items]</span>
      </header>

      {cart.length === 0 ? (
        <div className="py-24 text-center space-y-8">
          <p className="text-2xl font-light italic opacity-40">{t.checkout.empty}</p>
          <button onClick={onBack} className="text-[10px] uppercase font-bold tracking-[0.3em] border-b border-brand-ink pb-1">{t.shop.back}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {cart.map((item: any, i: number) => {
              const itemTotal = calculateItemTotal(item);
              return (
                  <div key={i} className="flex gap-8 group py-12 border-b border-brand-ink/5 last:border-0 relative">
                    <div className="w-40 h-52 border-technical overflow-hidden bg-brand-stone/5 shrink-0 relative">
                       <img src={item.image} className="w-full h-full object-cover grayscale opacity-80" alt={item.title} />
                       
                       {/* Mini Preview overlay */}
                       {item.customization && item.customization.length > 0 && (
                          <div className="absolute inset-0 pointer-events-none opacity-40">
                             {item.customization.map((p: any, idx: number) => (
                                p.side === 'front' && (
                                   <div 
                                      key={idx} 
                                      className="absolute w-2 h-2 bg-brand-accent rounded-full -translate-x-1/2 -translate-y-1/2"
                                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                   />
                                )
                             ))}
                          </div>
                       )}
                    </div>
                  <div className="flex-grow flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4">
                         <span className="tech-label border-brand-ink/30 px-3 tracking-widest">{item.num} / {item.size}</span>
                         {item.customization && item.customization.length > 0 && (
                           <span className="text-[9px] bg-brand-accent text-brand-bg px-3 py-1 font-black uppercase tracking-[0.2em] shadow-sm">
                             {item.customization.length} {t.studio.layers}
                           </span>
                         )}
                      </div>
                      <h3 className="text-3xl font-bold uppercase tracking-tighter leading-none">{item.title}</h3>
                      
                      {/* Technical Summary for Customer and Owner */}
                      {item.customization && item.customization.length > 0 && (
                        <div className="p-4 bg-brand-ink/[0.03] border-l-2 border-brand-accent space-y-4 mt-4">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3 underline decoration-brand-accent/30 underline-offset-4">Production Specification</p>
                              <div className="grid grid-cols-1 gap-2">
                                 {item.customization.map((p: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-start gap-4 py-2 border-b border-brand-ink/5 last:border-0">
                                       <div className="flex items-center gap-3">
                                          <div className="w-5 h-5 flex items-center justify-center text-[8px] font-black border border-brand-ink/10 bg-white">P{idx+1}</div>
                                          <div className="space-y-0.5">
                                             <span className="text-[10px] font-black uppercase block">{p.side} placement</span>
                                             <span className="text-[9px] font-mono opacity-40 block">TRANSFORM: {p.x.toFixed(0)}%X, {p.y.toFixed(0)}%Y, SCALE {p.size}%</span>
                                          </div>
                                       </div>
                                       <span className="text-[11px] font-bold tracking-tight bg-white px-2 border border-brand-ink/5 italic">"{p.value}"</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <p className="text-[9px] font-mono text-brand-accent/60 uppercase tracking-tighter">
                             * 2 spots included. Custom design fee: +€{Math.max(0, item.customization.length - 2) * 15}.00
                           </p>
                        </div>
                      )}
                      
                      <p className="font-mono text-[11px] opacity-40 uppercase">Base Price: {item.price}</p>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end min-w-[120px]">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            const spec = JSON.stringify(item.customization, null, 2);
                            navigator.clipboard.writeText(spec);
                            alert('Technical Spec Copied to Clipboard');
                          }}
                          className="opacity-40 hover:opacity-100 p-2 border border-brand-ink/10"
                          title="Copy Technical Specs for Production"
                        >
                          <Layers size={16} />
                        </button>
                        <button onClick={() => onRemove(i)} className="opacity-40 hover:opacity-100 hover:text-brand-accent transition-all duration-300">
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-mono opacity-20 uppercase tracking-widest leading-none">Net Value</p>
                         <span className="text-4xl font-black tracking-tighter leading-none block mt-2">€{itemTotal}.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 bg-brand-stone/10 p-10 border-technical space-y-12 h-fit">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-brand-ink/10 pb-4">{t.checkout.summary}</h4>
            <div className="space-y-12">
               {cart.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 pb-8 border-b border-brand-ink/10 last:border-0">
                     <div className="w-24 h-32 border-technical shrink-0 grayscale opacity-40">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                     </div>
                     <div className="flex-grow space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h5 className="text-xl font-bold uppercase tracking-tighter leading-none">{item.title}</h5>
                              <p className="text-[10px] font-mono opacity-40 uppercase mt-2">{item.num} / {item.size}</p>
                           </div>
                           <span className="text-xl font-black tracking-tighter">€{calculateItemTotal(item)}.00</span>
                        </div>
                        {item.customization && item.customization.length > 0 && (
                           <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono opacity-60">
                              {item.customization.map((p: any, idx: number) => (
                                 <div key={idx} className="flex justify-between border-b border-brand-ink/5">
                                    <span>{p.side} / P{idx+1}</span>
                                    <span className="font-bold">SPEC: {p.value.slice(0,10)}...</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               ))}
               
               <div className="pt-8 space-y-4">
                  <div className="flex justify-between text-[11px] font-mono opacity-40 uppercase tracking-widest">
                     <span>Logistic Fee</span>
                     <span>€0.00</span>
                  </div>
                  <div className="flex justify-between text-4xl font-black tracking-tighter pt-4 border-t border-brand-ink">
                     <span className="uppercase">Grand Total</span>
                     <span>€{total}.00</span>
                  </div>
               </div>
            </div>
            <button onClick={onCheckout} className="w-full py-8 bg-brand-ink text-brand-bg text-[12px] font-black uppercase tracking-[0.4em] hover:bg-brand-accent transition-colors">
               {t.shop.checkout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkout({ t, cart, onBack }: { t: any, cart: any[], onBack: () => void }) {
  const calculateItemTotal = (item: any) => {
    const basePrice = parseInt(item.price.replace('€', ''));
    const customizationSpots = item.customization?.length || 0;
    const additionalCost = Math.max(0, customizationSpots - 2) * 15;
    return basePrice + additionalCost;
  };

  const total = cart.reduce((acc: number, item: any) => acc + calculateItemTotal(item), 0);

  return (
    <div className="py-12 px-6 md:px-12 lg:px-24">
       <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-16 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-7 space-y-16">
           <header className="space-y-4">
              <h2 className="text-6xl font-bold tracking-tighter uppercase">{t.title}</h2>
              <p className="text-[11px] font-mono opacity-40 uppercase">Secure Transaction / VESTIR-SSL</p>
           </header>

           <div className="space-y-12">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8">{t.shipping}</h4>
                 <div className="grid grid-cols-2 gap-8">
                    <input type="text" placeholder="First Name" className="bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                    <input type="text" placeholder="Last Name" className="bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                 </div>
                 <input type="text" placeholder="Address" className="w-full bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                 <div className="grid grid-cols-3 gap-8">
                    <input type="text" placeholder="City" className="bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                    <input type="text" placeholder="State" className="bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                    <input type="text" placeholder="Zip" className="bg-transparent border-b border-brand-ink/20 py-4 font-bold tracking-tighter text-xl outline-none focus:border-brand-accent transition-colors" />
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8">{t.payment}</h4>
                 <div className="p-8 border-technical bg-white/5 space-y-8">
                    <div className="flex gap-4 items-center">
                       <CreditCard size={20} className="opacity-40" />
                       <span className="text-[11px] font-bold tracking-widest uppercase">Select Payment Mode</span>
                    </div>
                    <div className="h-[200px] border border-dashed border-brand-ink/10 flex items-center justify-center opacity-20 italic font-light">
                       Secure Terminal Initializing...
                    </div>
                 </div>
              </div>

              <button className="w-full py-8 bg-brand-ink text-brand-bg text-[12px] font-black uppercase tracking-[0.6em] hover:bg-brand-accent transition-colors flex items-center justify-center gap-4">
                 {t.placeOrder}
                 <ArrowRight size={20} />
              </button>
           </div>
        </div>

        <div className="lg:col-span-5">
           <div className="sticky top-40 bg-brand-stone/10 p-12 border-technical space-y-12">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-brand-ink/10 pb-4">{t.summary}</h4>
              <div className="space-y-6">
                 {cart.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-[11px] font-mono">
                       <span className="opacity-60">{item.title} [{item.size}]</span>
                       <span>{item.price}</span>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between text-2xl font-bold border-t border-brand-ink pt-6">
                 <span className="uppercase tracking-tighter">Total Due</span>
                 <span>€{total}.00</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PhilosophyPage({ t }: { t: any }) {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto space-y-32">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
               <span className="tech-label text-brand-accent border-brand-accent/30 font-bold">The Manifest</span>
               <div className="h-[1px] w-12 bg-brand-ink/10" />
            </div>
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-none">{t.title}</h2>
            <p className="text-2xl md:text-4xl font-light leading-relaxed text-brand-muted border-l-4 border-brand-accent pl-10 italic">
              {t.concept}
            </p>
          </div>
          <div className="aspect-[3/4] bg-brand-stone/10 border-technical overflow-hidden relative">
             <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Fabric" />
             <div className="absolute inset-0 bg-pattern opacity-[0.03]" />
          </div>
       </div>
    </div>
  );
}

function ContactPage({ t }: { t: any }) {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
          <div className="space-y-16">
            <div className="space-y-4">
               <span className="tech-label text-brand-accent border-brand-accent/30 font-bold">Transmissions</span>
               <h2 className="text-7xl md:text-9xl font-bold tracking-tighter uppercase leading-none">{t.title}</h2>
            </div>
            <p className="text-xl italic text-brand-muted border-l border-brand-ink/10 pl-8">{t.subtitle}</p>
            <div className="space-y-8">
              <div className="space-y-2 border-b border-brand-ink/10 pb-6">
                <span className="text-[10px] uppercase tracking-widest font-black opacity-30">Channel 01 / Email</span>
                <p className="text-2xl font-bold tracking-tighter">contact@atelier-vestir.com</p>
              </div>
              <div className="space-y-2 border-b border-brand-ink/10 pb-6">
                <span className="text-[10px] uppercase tracking-widest font-black opacity-30">Atelier 02 / Paris</span>
                <p className="text-2xl font-bold tracking-tighter">Rue du Faubourg Saint-Honoré</p>
              </div>
            </div>
          </div>
          <div className="space-y-12 bg-brand-stone/10 p-10 lg:p-20 border-technical relative">
             <div className="absolute inset-0 bg-pattern opacity-[0.02]" />
             <div className="space-y-8 relative z-10">
                <input type="text" placeholder="IDENTITY" className="w-full bg-transparent border-b border-brand-ink/20 py-6 font-bold tracking-tighter text-2xl outline-none focus:border-brand-accent transition-colors placeholder:opacity-20" />
                <input type="email" placeholder="ENCRYPTED_EMAIL" className="w-full bg-transparent border-b border-brand-ink/20 py-6 font-bold tracking-tighter text-2xl outline-none focus:border-brand-accent transition-colors placeholder:opacity-20" />
                <textarea placeholder="TRANSMISSION_DATA" rows={4} className="w-full bg-transparent border-b border-brand-ink/20 py-6 font-bold tracking-tighter text-2xl outline-none focus:border-brand-accent transition-colors resize-none placeholder:opacity-20"></textarea>
             </div>
             <button className="relative z-10 w-full py-8 bg-brand-ink text-brand-bg hover:bg-brand-accent transition-all font-black uppercase tracking-[0.4em] text-[11px]">
               {t.send}
             </button>
          </div>
       </div>
    </div>
  );
}

function Footer({ t, setCurrentPage }: { t: any, setCurrentPage: (p: any) => void }) {
  return (
    <footer className="relative bg-brand-bg pt-48 pb-12 px-6 md:px-12 lg:px-24 border-t border-brand-ink/5 z-10 overflow-hidden">
       {/* Tech decorative element */}
       <div className="absolute top-0 right-0 w-[40vw] h-full bg-brand-accent/5 blur-[100px] -z-10" />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-32 gap-32">
          <div className="space-y-12">
            <div className="text-4xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => setCurrentPage('home')}>VESTIR</div>
            <p className="max-w-xs text-brand-muted leading-relaxed font-light text-sm pr-12 border-r border-brand-ink/10">
              {t.philosophy}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32 w-full lg:w-auto">
            <FooterColumn 
              title="Atelier" 
              links={["The Process", "Drop Archives", "Custom Studio"]} 
            />
            <FooterColumn 
              title="Legal" 
              links={["Privacy Flow", "Terms of Narrative", "Returns"]} 
            />
            <div className="space-y-8 lg:mt-0 mt-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30">Transmissions</span>
              <div className="flex gap-8">
                <Instagram size={20} className="text-brand-ink opacity-40 hover:opacity-100 transition-all cursor-pointer" />
                <Mail size={20} className="text-brand-ink opacity-40 hover:opacity-100 transition-all cursor-pointer" />
                <Globe size={20} className="text-brand-ink opacity-40 hover:opacity-100 transition-all cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-brand-ink/5 gap-8 text-[9px] tracking-[0.3em] font-black text-brand-ink opacity-30 uppercase">
          <div>{t.rights}</div>
          <div className="flex gap-12">
             <span>Paris / Designed</span>
             <span>Shanghai / Sourced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-10">
      <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-charcoal/30">{title}</span>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm font-light tracking-widest hover:text-brand-charcoal text-brand-charcoal/60 transition-all duration-500 inline-block hover:translate-x-2 italic">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ isOpen, onClose, t, setCurrentPage }: { isOpen: boolean, onClose: () => void, t: any, setCurrentPage: (p: any) => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] bg-brand-bg flex flex-col justify-center items-start p-12 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.02] bg-pattern pointer-events-none" />
          
          <button className="absolute top-10 right-10 text-brand-ink" onClick={onClose}>
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="absolute top-10 left-12">
             <span className="text-2xl font-black tracking-tighter uppercase">NEOVORA</span>
          </div>

          <nav className="flex flex-col items-start gap-8 z-10">
            <button onClick={() => { setCurrentPage('collection'); onClose(); }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase hover:text-brand-accent transition-colors">{t.collection}</button>
            <button onClick={() => { setCurrentPage('collection'); onClose(); }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase hover:text-brand-accent transition-colors">{t.custom}</button>
            <button onClick={() => { setCurrentPage('about'); onClose(); }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase hover:text-brand-accent transition-colors">{t.about}</button>
            <button onClick={() => { setCurrentPage('contact'); onClose(); }} className="text-6xl md:text-8xl font-black tracking-tighter uppercase hover:text-brand-accent transition-colors">{t.contact}</button>
          </nav>

          <div className="mt-16 flex gap-8 z-10">
            <div className="p-4 border-technical">
              <Instagram size={24} className="opacity-40 hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4 border-technical">
              <Mail size={24} className="opacity-40 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StudioPage({ t, onAddToCart, onBack }: { t: any, onAddToCart: (p: any, s: string) => void, onBack: () => void }) {
  return null; // Integrated into ProductDetail
}
