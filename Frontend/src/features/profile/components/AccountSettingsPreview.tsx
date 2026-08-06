import React, { useState } from 'react';
import { Settings, Bell, Moon, Mail, ExternalLink } from 'lucide-react';
import Card from '../../../components/ui/Card';

export interface AccountSettingsPreviewProps {
  email: string;
}

export const AccountSettingsPreview: React.FC<AccountSettingsPreviewProps> = ({ email }) => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-arctic tracking-tight">
            Account Settings Preview
          </h2>
        </div>
      </div>

      <div className="space-y-3.5 text-xs text-slopes">
        {/* Email Readout */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-apres uppercase flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <div className="p-2.5 rounded-xl bg-mountainside/40 border border-apres/20 text-arctic font-mono truncate">
            {email || 'user@mlvisuallab.com'}
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-mono text-apres uppercase flex items-center gap-1">
            <Bell className="w-3.5 h-3.5" /> Notifications
          </label>
          <div className="space-y-2 bg-mountainside/20 p-2.5 rounded-xl border border-apres/20">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Email Updates & Digests</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Streak & Lab Reminders</span>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
            </label>
          </div>
        </div>

        {/* Theme Preference */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-mono text-apres uppercase flex items-center gap-1">
            <Moon className="w-3.5 h-3.5" /> App Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="w-full p-2.5 rounded-xl bg-mountainside border border-apres/40 text-arctic font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="dark">Midnight Dark (Default)</option>
            <option value="light">Light Mode</option>
            <option value="system">System Preference</option>
          </select>
        </div>
      </div>
    </Card>
  );
};

export default AccountSettingsPreview;
