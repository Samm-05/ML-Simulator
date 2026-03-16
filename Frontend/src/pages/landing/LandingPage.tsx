import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutSection';
import AlgorithmsSection from './AlgorithmsSection';
import VisualizationSection from './VisualizationSection';
import PracticeSection from './PracticeSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <AlgorithmsSection />
      <VisualizationSection />
      <PracticeSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
