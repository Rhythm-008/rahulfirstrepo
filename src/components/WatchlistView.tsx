import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Circle, ArrowRight, Trash2, Award, Clock } from 'lucide-react';
import { useLecturePulse } from '../context/LecturePulseContext';
import { Lecture } from '../types';
import { RatingStars } from './RatingStars';

interface WatchlistViewProps {
  onSelectLecture: (lecture: Lecture) => void;
  onSelectTeacherById: (teacherId: string) => void;
  onNavigateToLectures: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  onSelectLecture,
  onSelectTeacherById,
  onNavigateToLectures,
}) => {
  const { watchlist, toggleWatchlist, lectures } = useLecturePulse();
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savedLectures = watchlist
    .map((id) => lectures.find((l) => l.id === id))
    .filter(Boolean) as Lecture[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            My Study Watchlist & Monitored Lectures
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Your personal queue of lectures flagged for midterm revision, concept review, or homework preparation.
          </p>
        </div>

        <span className="text-xs font-mono tabular-nums bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-600 self-start sm:self-auto">
          {savedLectures.length} lectures queued
        </span>
      </div>

      {savedLectures.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-lg mx-auto">
          <Bookmark className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-900">Your study watchlist is empty</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4 leading-relaxed">
            Browse the lecture monitor and click the bookmark icon on lectures you want to prioritize or revisit before exams.
          </p>
          <button
            onClick={onNavigateToLectures}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Explore Lectures
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedLectures.map((lec) => {
            const isDone = !!completedItems[lec.id];
            return (
              <div
                key={lec.id}
                className={`bg-white border rounded-xl p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone ? 'border-neutral-200 opacity-70 bg-neutral-50/50' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleComplete(lec.id)}
                    className="mt-0.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                    title={isDone ? 'Mark as incomplete' : 'Mark as studied'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="font-semibold text-neutral-900">{lec.courseCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>Lecture {lec.lectureNumber.toString().padStart(2, '0')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lec.durationMinutes} min</span>
                      {lec.alertFlags.isExamPrepCritical && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-medium">Exam Essential</span>
                        </>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectLecture(lec)}
                      className={`text-base font-bold text-neutral-900 hover:text-blue-600 cursor-pointer transition-colors ${
                        isDone ? 'line-through text-neutral-500' : ''
                      }`}
                    >
                      {lec.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-600 mt-1">
                      <span>Instructor:</span>
                      <button
                        onClick={() => onSelectTeacherById(lec.professorId)}
                        className="font-medium text-neutral-900 hover:text-blue-600 underline"
                      >
                        {lec.professorName}
                      </button>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className="text-neutral-500">Rigor: {lec.ratings.difficulty.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  <div className="text-left md:text-right text-xs">
                    <div className="flex items-center gap-1 md:justify-end">
                      <RatingStars rating={lec.ratings.overall} size="sm" />
                      <span className="font-mono font-bold text-neutral-900 tabular-nums">
                        {lec.ratings.overall.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {lec.ratings.totalRatingsCount} evaluations
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectLecture(lec)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Evaluation</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleWatchlist(lec.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors hover:bg-red-50"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
