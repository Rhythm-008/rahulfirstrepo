import React from 'react';
import { X, Scale, ArrowRight, ExternalLink } from 'lucide-react';
import { useLecturePulse } from '../context/LecturePulseContext';
import { RatingStars } from './RatingStars';
import { Lecture } from '../types';

interface CompareDrawerProps {
  onSelectLecture: (lecture: Lecture) => void;
  onSelectTeacherById: (teacherId: string) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  onSelectLecture,
  onSelectTeacherById,
}) => {
  const { compareList, removeFromCompare, clearCompare, lectures } = useLecturePulse();

  if (compareList.length === 0) return null;

  const comparedLectures = compareList
    .map((id) => lectures.find((l) => l.id === id))
    .filter(Boolean) as Lecture[];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar of drawer */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-neutral-800" />
            <h3 className="text-sm font-bold text-neutral-900">
              Side-by-Side Lecture Comparison ({comparedLectures.length} of max 3)
            </h3>
            <span className="text-xs text-neutral-500">
              Compare clarity, pacing, and difficulty to plan study time
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline"
            >
              Clear All
            </button>
            <button
              onClick={clearCompare}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(3, comparedLectures.length)} gap-4 pt-3 text-xs`}>
          {comparedLectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 relative flex flex-col justify-between"
            >
              <button
                onClick={() => removeFromCompare(lec.id)}
                className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-700 rounded"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  {lec.courseCode} · L{lec.lectureNumber.toString().padStart(2, '0')}
                </div>
                <h4
                  onClick={() => onSelectLecture(lec)}
                  className="font-bold text-neutral-900 hover:text-blue-600 cursor-pointer line-clamp-1 mt-0.5"
                >
                  {lec.title}
                </h4>

                <button
                  onClick={() => onSelectTeacherById(lec.professorId)}
                  className="text-[11px] text-neutral-600 hover:text-neutral-900 underline block mt-0.5"
                >
                  {lec.professorName}
                </button>

                <div className="flex items-center gap-1.5 my-2">
                  <RatingStars rating={lec.ratings.overall} size="sm" />
                  <span className="font-mono font-bold text-neutral-900 tabular-nums">
                    {lec.ratings.overall.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    ({lec.ratings.totalRatingsCount} reviews)
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-neutral-200/60 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Clarity:</span>
                    <span className="font-mono font-semibold tabular-nums">{lec.ratings.clarity.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pacing:</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {lec.ratings.pacing >= 4 ? 'Fast (Alert)' : lec.ratings.pacing <= 2 ? 'Slow' : 'Ideal'} ({lec.ratings.pacing.toFixed(1)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Difficulty:</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {lec.ratings.difficulty >= 4.2 ? 'Intense Rigor' : 'Moderate'} ({lec.ratings.difficulty.toFixed(1)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Exam Value:</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {lec.ratings.examRelevance.toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-neutral-200/60 flex items-center justify-between">
                <button
                  onClick={() => onSelectLecture(lec)}
                  className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                >
                  <span>Full Evaluation</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
