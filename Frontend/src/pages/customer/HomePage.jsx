import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import { ArrowUpRight, ChevronRight, Loader, Shield, Sparkles, Star, Zap } from 'lucide-react';

const characterDrops = [
  { name: 'Spider-Man', detail: 'Web-slinging ready', color: 'red', image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=800&q=85' },
  { name: 'Hulk', detail: 'Smash-approved suits', color: 'green', image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=800&q=85' },
  { name: 'Batman', detail: 'Gotham after dark', color: 'black', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=85' },
  { name: 'Iron Man', detail: 'Armor up in style', color: 'orange', image: 'https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=crop&w=800&q=85' }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, allProducts] = await Promise.all([
          getFeaturedProducts(),
          getProducts()
        ]);
        setFeaturedProducts(featured.data.data || []);
        setNewProducts((allProducts.data.data || []).slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  return (
    <div className="storefront">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> The character drop</p>
          <h1>SUIT UP.<br /><span>STAND OUT.</span></h1>
          <p className="hero-text">Big energy for little heroes. Find officially-inspired looks for the next birthday, school day, or super mission.</p>
          <Link to="/products?category=Superhero" className="lime-button">Explore the drop <ArrowUpRight size={17} /></Link>
        </div>
        <div className="hero-art" aria-label="Superhero costume collection">
          <div className="hero-sun" />
          <div className="hero-burst">POW!</div>
          <div className="hero-image hero-image-main" />
          <div className="hero-sticker">NEW<br /><strong>HERO<br />MODE</strong></div>
        </div>
      </section>

      <section className="promise-strip">
        <div><Shield size={21} /><span><b>BUILT FOR PLAY</b>Costumes that move with them.</span></div>
        <div><Zap size={21} /><span><b>FAST POWER-UP</b>Ships in 1-2 business days.</span></div>
        <div><Sparkles size={21} /><span><b>ZERO BORING</b>Looks made for main characters.</span></div>
      </section>

      <section className="drop-section">
        <div className="section-heading">
          <div><p className="eyebrow">Pick your power</p><h2>CHARACTER <span>DROPS</span></h2></div>
          <Link to="/products" className="text-link">View all costumes <ChevronRight size={16} /></Link>
        </div>
        <div className="character-grid">
          {characterDrops.map((character) => (
            <Link key={character.name} to="/products?category=Superhero" className={`character-card ${character.color}`}>
              <img src={character.image} alt={`${character.name} costume collection`} />
              <div className="character-overlay"><p>{character.detail}</p><h3>{character.name}</h3><span>Shop looks <ArrowUpRight size={14} /></span></div>
            </Link>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="catalog-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading"><div><p className="eyebrow">Fresh from headquarters</p><h2>TOP <span>PICKS</span></h2></div><Star size={20} fill="currentColor" /></div>
            {loading ? <div className="flex justify-center"><Loader className="animate-spin" size={40} /></div> : <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">{featuredProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
          </div>
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="catalog-section new-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="section-heading"><div><p className="eyebrow">Just landed</p><h2>NEW <span>ARRIVALS</span></h2></div></div>
            {loading ? <div className="flex justify-center"><Loader className="animate-spin" size={40} /></div> : <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">{newProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
          </div>
        </section>
      )}

      <section className="family-banner">
        <div><p className="eyebrow">The CostumeMart club</p><h2>MAKE THEIR<br /><span>ENTRANCE ICONIC.</span></h2></div>
        <div><p>Get first access to fresh drops, party ideas, and heroic savings.</p><Link to="/products" className="lime-button">Shop all costumes <ArrowUpRight size={17} /></Link></div>
      </section>
    </div>
  );
}
