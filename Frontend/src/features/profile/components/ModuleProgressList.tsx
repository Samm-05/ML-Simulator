import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PlayCircle, Lock, BookOpen, ChevronRight, Layers } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { coachModulesData } from '../../coach/coachData';

export interface ModuleProgressListProps {
  completedModuleIds: string[];
}

export const ModuleProgressList: React.FC<ModuleProgressListProps> = ({ completedModuleIds }) => {
  const navigate = useNavigate();

  const totalModules = coachModulesData.length;
  const completedCount = completedModuleIds.length;
  const overallPercentage = Math.round((completedCount / totalModules) * 100);

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-6">
      {/* Header & Overall Ring Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mountainside pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-arctic tracking-tight">
              ML Coach Curriculum Progress
            </h2>
          </div>
          <p className="text-xs text-slopes font-mono mt-1">
            {completedCount} of {totalModules} Modules Mastered ({overallPercentage}%)
          </p>
        </div>

        {/* Mini Overall Progress Bar */}
        <div className="w-full sm:w-48 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-apres">
            <span>Overall Completion</span>
            <span className="text-emerald-400 font-bold">{overallPercentage}%</span>
          </div>
          <div className="h-2.5 bg-mountainside rounded-full overflow-hidden border border-apres/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Per-Module Progress Cards */}
      <div className="space-y-3.5">
        {coachModulesData.map((module) => {
          const isCompleted = completedModuleIds.includes(module.id);
          const sectionsCount = module.sections.length;
          const completedSections = isCompleted ? sectionsCount : 0;
          const modulePercent = isCompleted ? 100 : 0;

          return (
            <div
              key={module.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                  : 'bg-mountainside/30 border-apres/20 hover:border-apres/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                      : 'bg-mountainside border-apres/30 text-slopes'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-apres uppercase">
                      Module {module.moduleNumber}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-mountainside text-slopes border border-apres/30">
                        {completedSections > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-arctic tracking-tight">{module.title}</h3>
                  <p className="text-xs text-slopes line-clamp-1">{module.shortDescription}</p>
                </div>
              </div>

              {/* Progress & Action Button */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-mountainside pt-3 sm:pt-0">
                <div className="text-right font-mono text-xs space-y-1">
                  <span className="text-apres text-[11px]">{completedSections} / {sectionsCount} Sections</span>
                  <div className="w-24 h-1.5 bg-mountainside rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-cyan-500'}`}
                      style={{ width: `${modulePercent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/coach/module/${module.id}`)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCompleted
                      ? 'bg-mountainside/80 border border-apres/40 text-slopes hover:text-arctic hover:bg-mountainside'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-soft'
                  }`}
                >
                  <span>{isCompleted ? 'Review' : 'Start'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ModuleProgressList;
