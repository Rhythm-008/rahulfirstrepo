import React from 'react';
import { Bookmark, Sparkles, GraduationCap, PlusCircle } from 'lucide-react';
import { useLecturePulse } from '../context/LecturePulseContext';

interface TopBarProps {
  activeTab: 'lectures' | 'teachers' | 'analytics' | 'watchlist';
  setActiveTab: (tab: 'lectures' | 'teachers' | 'analytics' | 'watchlist') => void;
  onOpenAddLectureModal: () => void;
  onOpenQuickRateModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddLectureModal,
  onOpenQuickRateModal,
}) => {
  const { watchlist, student } = useLecturePulse();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('lectures')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                LR
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
                LectureRate
              </span>
            </button>
            <span className="hidden sm:inline-block text-neutral-300">|</span>
            <span className="hidden sm:inline-block text-xs font-medium text-neutral-500 whitespace-nowrap">
              Student Evaluation Portal
            </span>
          </div>

          {/* Zone 2: 4 single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('lectures')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'lectures'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Lecture Monitor
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'teachers'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Professor Intel & Advice
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Rating Analytics
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`whitespace-nowrap pb-0.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'watchlist'
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="text-xs px-1.5 py-0.2 font-mono tabular-nums bg-neutral-100 text-neutral-700 rounded">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action button + student profile */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-600 pr-2 border-r border-neutral-200">
              <span className="font-semibold text-neutral-800">{student.name}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 font-mono text-[11px]">{student.major.split('&')[0]}</span>
            </div>

            <button
              onClick={onOpenQuickRateModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 active:bg-neutral-950 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Rate a Lecture</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-neutral-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('lectures')}
            className={`px-2 py-1 rounded ${
              activeTab === 'lectures' ? 'font-semibold text-neutral-900 bg-neutral-100' : 'text-neutral-600'
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-2 py-1 rounded ${
              activeTab === 'teachers' ? 'font-semibold text-neutral-900 bg-neutral-100' : 'text-neutral-600'
            }`}
          >
            Teachers & Advice
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2 py-1 rounded ${
              activeTab === 'analytics' ? 'font-semibold text-neutral-900 bg-neutral-100' : 'text-neutral-600'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-2 py-1 rounded ${
              activeTab === 'watchlist' ? 'font-semibold text-neutral-900 bg-neutral-100' : 'text-neutral-600'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>
      </div>
    </header>
  );
};
