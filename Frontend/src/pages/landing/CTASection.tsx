import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../animations/scrollAnimations';

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal>
        <h2 className="text-4xl font-semibold text-white">Start Your Machine Learning Journey Today</h2>
        <p className="mt-4 text-xl font-medium text-secondary-200">
          Create an account and explore machine learning through interactive visual simulations.
        </p>
        <Link
          to="/signup"
          className="inline-flex mt-8 px-7 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold tracking-wide transition-colors"
        >
          Create Free Account
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
