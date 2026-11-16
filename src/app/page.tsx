import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programmes from './components/Programmes';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Programmes />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
