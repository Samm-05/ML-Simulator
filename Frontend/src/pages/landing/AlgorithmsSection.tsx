import React, { useRef } from 'react';
import AlgorithmCard from '../../components/landing/AlgorithmCard';
import { useScrollReveal } from '../../animations/scrollAnimations';

const algorithms = [
  {
    name: 'Linear Regression',
    description: 'Fit a best-fit line and inspect gradient updates against training samples.',
    difficulty: 'Beginner' as const,
    route: '/simulator/linear-regression',
  },
  {
    name: 'K-Means Clustering',
    description: 'Observe cluster assignment and centroid movement across iterations.',
    difficulty: 'Intermediate' as const,
    route: '/simulator/kmeans',
  },
  {
    name: 'Decision Trees',
    description: 'Visualize splits, impurity reduction, and prediction paths.',
    difficulty: 'Intermediate' as const,
    route: '/simulator/decision-tree',
  },
  {
    name: 'Gradient Descent',
    description: 'Track convergence behavior under learning-rate adjustments.',
    difficulty: 'Beginner' as const,
    route: '/simulator/linear-regression',
  },
  {
    name: 'Logistic Regression',
    description: 'Understand probability boundaries and binary class separation.',
    difficulty: 'Advanced' as const,
    route: '/simulator/linear-regression',
  },
];

const AlgorithmsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="algorithms" ref={sectionRef} className="py-20 bg-secondary-100 dark:bg-secondary-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">Algorithms You Can Practice</h2>
          <p className="mt-4 text-base text-secondary-600 dark:text-secondary-300 max-w-3xl">
            Explore core machine learning concepts through guided simulators that make model behavior transparent and interactive.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm) => (
            <AlgorithmCard
              key={algorithm.name}
              name={algorithm.name}
              description={algorithm.description}
              difficulty={algorithm.difficulty}
              route={algorithm.route}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmsSection;
