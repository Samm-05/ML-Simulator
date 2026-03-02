import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : {}}
      className={`
        bg-white dark:bg-secondary-800
        rounded-xl shadow-soft
        border border-secondary-100 dark:border-secondary-700
        transition-all duration-200
        ${hoverable ? 'cursor-pointer hover:shadow-medium' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;