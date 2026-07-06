import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import About from '../components/About';
import Faculty from '../components/Faculty';
import Toppers from '../components/Toppers';
import Quotes from '../components/Quotes';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';

const HomePage = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      // Immediately reveal elements already visible in the viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('active');
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="reveal"><Hero /></section>
        <section className="reveal"><Quotes /></section>
        <section className="reveal"><Courses /></section>
        <section className="reveal"><Faculty /></section>
        <section className="reveal"><Toppers /></section>
        <section className="reveal"><About /></section>
        <section className="reveal"><Reviews /></section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
