import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import About from '../components/About';
import Footer from '../components/Footer';

const HomePage = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="reveal"><Hero /></section>
        <section className="reveal"><Courses /></section>
        <section className="reveal"><About /></section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
