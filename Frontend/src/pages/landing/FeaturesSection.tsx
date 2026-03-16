import React, { useRef } from 'react';
import { SlidersHorizontal, Sparkles, FlaskConical, MonitorPlay } from 'lucide-react';
import FeatureCard from '../../components/landing/FeatureCard';
import { useScrollReveal } from '../../animations/scrollAnimations';

const featureItems = [
  {
    icon: MonitorPlay,
    title: 'Interactive Algorithm Simulations',
    description: 'See each algorithm evolve step-by-step with visual states and intuitive controls.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Real-Time Parameter Tuning',
    description: 'Adjust parameters instantly and observe how model behavior changes in real time.',
  },
  {
    icon: Sparkles,
    title: 'AI Guided Explanations',
    description: 'Understand model decisions with contextual explanations designed for learners.',
  },
  {
    icon: FlaskConical,
    title: 'Custom Dataset Experiments',
    description: 'Upload your own data and test algorithm performance under realistic scenarios.',
  },
];

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="features" ref={sectionRef} className="py-20 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl" data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">Features Built for Deep Understanding</h2>
          <p className="mt-4 text-base text-secondary-600 dark:text-secondary-300">
            ML Visual Lab combines algorithm simulation, guided intuition, and practical experimentation in one focused learning workspace.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureItems.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
