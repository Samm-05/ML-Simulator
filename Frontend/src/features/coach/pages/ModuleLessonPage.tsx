import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { markModuleCompleted } from '../coachSlice';
import { coachModulesData } from '../coachData';
import PageContainer from '../../../components/layout/PageContainer';
import Card from '../../../components/ui/Card';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChevronLeft, ChevronRight, CheckCircle2, ChevronRight as BreadcrumbChevron } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ModuleLessonPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const mathRef = useRef<HTMLDivElement>(null);

  const moduleData = coachModulesData.find((m) => m.id === moduleId);

  // If module not found, redirect to /coach
  useEffect(() => {
    if (!moduleData) {
      navigate('/coach', { replace: true });
    }
  }, [moduleData, navigate]);

  if (!moduleData) return null;

  const currentSection = moduleData.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === moduleData.sections.length - 1;

  // Render KaTeX formula if present
  useEffect(() => {
    if (currentSection?.mathFormula && mathRef.current) {
      try {
        katex.render(currentSection.mathFormula, mathRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    }
  }, [currentSection]);

  const handleNext = () => {
    if (isLastSection) {
      // Mark as completed and return to ML Coach Home Page
      dispatch(markModuleCompleted(moduleData.id));
      navigate('/coach');
    } else {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-6 font-sans select-none">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-3 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-apres">
          <button
            type="button"
            onClick={() => navigate('/coach')}
            className="hover:text-arctic transition-colors cursor-pointer"
          >
            ML Coach
          </button>
          <BreadcrumbChevron className="w-3.5 h-3.5 text-apres/60" />
          <span className="text-arctic font-medium">{moduleData.title}</span>
        </nav>

        {/* Large Module Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-arctic font-sans">
            {moduleData.title}
          </h1>
          <p className="text-sm text-slopes font-mono">
            Module {moduleData.moduleNumber}: {moduleData.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Reading Area Card */}
      <div className="max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 sm:p-8 space-y-6 bg-midnight/90 border border-apres/30 shadow-2xl rounded-2xl">
              {/* Section Header */}
              <h2 className="text-xl sm:text-2xl font-bold text-arctic tracking-tight">
                {currentSection.title}
              </h2>

              {/* Section Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slopes leading-relaxed font-sans">
                {currentSection.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Mathematical Foundation Box (if available) */}
              {currentSection.mathFormula && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider">
                    The Mathematical Foundation
                  </div>
                  <div className="p-4 bg-mountainside/40 border border-apres/30 rounded-xl flex items-center justify-center">
                    <div ref={mathRef} className="text-emerald-400 font-mono text-base overflow-x-auto py-1" />
                  </div>
                </div>
              )}

              {/* Bullet Points List (if available) */}
              {currentSection.bulletPoints && currentSection.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pt-2 text-sm text-slopes font-sans">
                  {currentSection.bulletPoints.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <div>
                        {item.label && (
                          <strong className="text-arctic font-mono mr-1.5">{item.label}:</strong>
                        )}
                        <span>{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Code Snippet Box (if available) */}
              {currentSection.codeSnippet && (
                <div className="space-y-2 pt-3">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider">
                    Implementation in Python
                  </div>
                  <div className="p-4 bg-[#080c10] border border-apres/30 rounded-xl font-mono text-xs text-arctic overflow-x-auto leading-relaxed shadow-inner">
                    <pre className="text-cyan-300 whitespace-pre">
                      <code>{currentSection.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="max-w-4xl flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstSection}
          className="px-5 py-2.5 rounded-xl bg-mountainside/60 border border-apres/30 text-xs sm:text-sm font-semibold font-mono text-slopes hover:text-arctic hover:bg-mountainside/80 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-mono transition-all flex items-center gap-2 shadow-md cursor-pointer ${
            isLastSection
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <span>{isLastSection ? 'Finish Module' : 'Next'}</span>
          {isLastSection ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </PageContainer>
  );
};

export default ModuleLessonPage;
