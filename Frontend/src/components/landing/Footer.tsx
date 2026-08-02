import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-950 border-t border-secondary-800 text-secondary-400 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-600/20 border border-primary-500/40 text-primary-400">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                ML Visual Lab
              </span>
            </Link>
            <p className="text-sm text-secondary-400 leading-relaxed max-w-sm">
              The browser-based 3D visual lab for machine learning algorithms. Master complex AI mathematics intuitively.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono text-emerald-400">WebGL Simulation Engine Active</span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">Simulators</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/simulator/linear-regression" className="hover:text-white transition-colors">
                  Linear Regression
                </Link>
              </li>
              <li>
                <Link to="/simulator/kmeans" className="hover:text-white transition-colors">
                  K-Means Clustering
                </Link>
              </li>
              <li>
                <Link to="/simulator/decision-tree" className="hover:text-white transition-colors">
                  Decision Trees
                </Link>
              </li>
              <li>
                <Link to="/simulator/logistic-regression" className="hover:text-white transition-colors">
                  Logistic Regression
                </Link>
              </li>
              <li>
                <Link to="/simulator/pca" className="hover:text-white transition-colors">
                  PCA Dimensionality
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-white transition-colors">
                  Practice Challenges
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">Social & Community</h4>
            <div className="flex gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-secondary-900 border border-secondary-800 hover:border-primary-500 text-secondary-300 hover:text-white transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-secondary-900 border border-secondary-800 hover:border-primary-500 text-secondary-300 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-secondary-900 border border-secondary-800 hover:border-primary-500 text-secondary-300 hover:text-white transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-secondary-900 flex flex-col sm:flex-row justify-between items-center text-xs text-secondary-500 gap-4">
          <p>© {new Date().getFullYear()} ML Visual Lab. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-error fill-error" />
            <span>for Data Science Learners worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
