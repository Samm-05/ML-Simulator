import React, { useRef } from 'react';
import TestimonialCard from '../../components/landing/TestimonialCard';
import { useScrollReveal } from '../../animations/scrollAnimations';

const testimonials = [
  {
    quote: 'ML Visual Lab helped me finally understand clustering algorithms.',
    name: 'Aarav S.',
    role: 'Computer Science Student',
  },
  {
    quote: 'The simulator made gradient descent intuitive instead of abstract.',
    name: 'Riya M.',
    role: 'Data Science Learner',
  },
  {
    quote: 'Great for teaching ML concepts quickly with visuals and experiments.',
    name: 'Neel P.',
    role: 'Instructor',
  },
];

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 bg-white dark:bg-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">What Learners Say</h2>
          <p className="mt-4 text-base text-secondary-600 dark:text-secondary-300">
            Feedback from students and practitioners using ML Visual Lab.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} quote={item.quote} name={item.name} role={item.role} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
