import React, { useState, useEffect } from 'react';
import { Camera, Edit3, Save, Share2, Check, Sparkles, Award, Flame, Trophy, Layers } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { toast } from 'react-hot-toast';

export interface ProfileHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    handle?: string;
    bio?: string;
    avatar?: string;
    joinedAt: string;
    points: number;
    streak: number;
    rank: number;
    completedModulesCount: number;
    totalModulesCount: number;
  };
  isEditing: boolean;
  onToggleEdit: () => void;
  onSaveProfile: (data: { firstName: string; lastName: string; bio: string; handle: string }) => void;
  onAvatarUpload: (file: File) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  onToggleEdit,
  onSaveProfile,
  onAvatarUpload,
}) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [handle, setHandle] = useState(user.handle || '');
  const [bio, setBio] = useState(user.bio || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setHandle(user.handle || '');
    setBio(user.bio || '');
  }, [user]);

  const getTitleBadge = (points: number, completedCount: number) => {
    if (completedCount >= 5 || points >= 2500) return { title: 'Deep Learning Architect', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' };
    if (completedCount >= 3 || points >= 1200) return { title: 'Gradient Descent Expert', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (completedCount >= 1 || points >= 500) return { title: 'Supervised ML Specialist', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' };
    return { title: 'ML Practitioner', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
  };

  const badgeInfo = getTitleBadge(user.points, user.completedModulesCount);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Profile URL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  const handleSave = () => {
    onSaveProfile({ firstName, lastName, handle, bio });
  };

  const displayInitial = (firstName[0] || user.email[0] || 'U').toUpperCase();

  return (
    <Card className="p-6 sm:p-8 bg-midnight/90 border border-mountainside rounded-3xl space-y-6 shadow-hard relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center sm:items-start md:items-center justify-between gap-6 relative z-10">
        {/* Avatar & Camera Upload */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-apres/40 shadow-soft">
            {user.avatar ? (
              <img src={user.avatar} alt={firstName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-white font-mono uppercase">
                {displayInitial}
                {lastName[0] ? lastName[0].toUpperCase() : ''}
              </span>
            )}
          </div>

          <label
            htmlFor="avatar-input"
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-mountainside border border-apres/60 flex items-center justify-center cursor-pointer hover:bg-apres/30 transition-all shadow-md group-hover:scale-105"
            title="Upload Avatar Image"
          >
            <Camera className="w-4 h-4 text-arctic" />
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* User Info & Bio */}
        <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
          {isEditing ? (
            <div className="space-y-3 max-w-lg">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="p-2.5 bg-mountainside border border-apres/40 rounded-xl text-arctic text-sm focus:outline-none focus:border-cyan-400 font-sans"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="p-2.5 bg-mountainside border border-apres/40 rounded-xl text-arctic text-sm focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@handle"
                className="w-full p-2.5 bg-mountainside border border-apres/40 rounded-xl text-cyan-300 text-sm font-mono focus:outline-none focus:border-cyan-400"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio or tagline"
                rows={2}
                className="w-full p-2.5 bg-mountainside border border-apres/40 rounded-xl text-slopes text-sm focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-arctic tracking-tight">
                  {firstName} {lastName}
                </h1>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{handle}</span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${badgeInfo.color} uppercase tracking-wider`}>
                  {badgeInfo.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slopes font-sans leading-relaxed max-w-xl">
                {bio || 'Active Machine Learning Practitioner exploring 3D interactive laboratories and algorithm theory.'}
              </p>
              <div className="text-xs font-mono text-apres flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span>Member since {user.joinedAt}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-center sm:self-start md:self-center shrink-0">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleEdit}
              className="px-4 py-2.5 bg-mountainside/80 hover:bg-mountainside border border-apres/40 text-arctic rounded-xl text-xs font-bold font-mono transition-all shadow-soft flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              Edit Profile
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 bg-mountainside/80 hover:bg-mountainside border border-apres/40 text-slopes hover:text-arctic rounded-xl transition-all shadow-soft cursor-pointer"
            title="Share Profile Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Small Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-mountainside/60 relative z-10">
        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-apres">
            <span>Modules Done</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-arctic font-mono">
            {user.completedModulesCount} <span className="text-xs text-apres font-normal">/ {user.totalModulesCount}</span>
          </p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-apres">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">
            {user.streak} <span className="text-xs text-apres font-normal">Days</span>
          </p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-apres">
            <span>Total XP</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-arctic font-mono">
            {user.points.toLocaleString()} <span className="text-xs text-purple-400 font-normal">XP</span>
          </p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-apres">
            <span>Global Rank</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-xl font-bold text-yellow-400 font-mono">
            #{user.rank}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
