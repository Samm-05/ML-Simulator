import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Header Card Skeleton */}
      <div className="p-6 sm:p-8 bg-midnight/90 border border-mountainside rounded-3xl space-y-6 shadow-hard">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-mountainside/80 border border-apres/30 shrink-0" />
          <div className="flex-1 space-y-3 text-center sm:text-left w-full">
            <div className="h-7 w-48 bg-mountainside/80 rounded-xl mx-auto sm:mx-0" />
            <div className="h-4 w-32 bg-mountainside/50 rounded-lg mx-auto sm:mx-0" />
            <div className="h-4 w-64 bg-mountainside/40 rounded-lg mx-auto sm:mx-0" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-mountainside/80 rounded-xl" />
            <div className="h-10 w-10 bg-mountainside/80 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-mountainside/60">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-mountainside/30 rounded-2xl border border-apres/20 space-y-2">
              <div className="h-3 w-20 bg-mountainside/60 rounded-md" />
              <div className="h-6 w-16 bg-mountainside/90 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
          <div className="h-80 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
          <div className="h-64 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
          <div className="h-64 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
          <div className="h-48 bg-midnight/90 border border-mountainside rounded-2xl p-6" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
