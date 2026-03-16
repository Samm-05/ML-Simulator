import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { mountHeroScene } from '../../three/HeroScene';
import { useHeroAnimation } from '../../animations/heroAnimation';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useHeroAnimation(heroRef);

  useEffect(() => {
    if (!sceneRef.current) {
      return undefined;
    }
    return mountHeroScene(sceneRef.current);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-secondary-900 via-secondary-900 to-secondary-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-secondary-100">
          <p data-hero-fade className="text-sm sm:text-base font-semibold tracking-widest uppercase text-primary-300">
            Interactive Learning Platform
          </p>
          <h1
            data-hero-fade
            className="mt-4 text-5xl md:text-6xl leading-tight font-bold text-white"
          >
            Learn Machine Learning Visually
          </h1>
          <p data-hero-fade className="mt-6 text-xl font-medium text-secondary-200 max-w-xl">
            Experiment with machine learning algorithms like Linear Regression, K-Means, and Decision Trees through
            interactive real-time simulations.
          </p>

          <motion.div data-hero-fade className="mt-8 flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold tracking-wide hover:bg-primary-700 transition-colors"
            >
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#algorithms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-secondary-500 text-secondary-100 font-semibold tracking-wide hover:bg-secondary-700 transition-colors"
            >
              Explore Algorithms <PlayCircle className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary-600/30 to-accent-500/20 blur-xl" />
          <div ref={sceneRef} className="relative h-[340px] sm:h-[420px] lg:h-[500px] rounded-2xl border border-secondary-700 bg-secondary-900/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
