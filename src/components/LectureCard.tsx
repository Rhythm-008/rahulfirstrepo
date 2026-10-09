import React from 'react';
import { Bookmark, Scale, ArrowRight, Video, FileText, AlertCircle, Award, Gauge } from 'lucide-react';
import { Lecture } from '../types';
import { RatingStars } from './RatingStars';
import { useLecturePulse } from '../context/LecturePulseContext';

interface LectureCardProps {
  lecture: Lecture;
  onSelectLecture: (lecture: Lecture) => void;
  onSelectTeacherById: (teacherId: string) => void;
  onOpenRateModal: (lecture: Lecture) => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({
  lecture,
  onSelectLecture,
  onSelectTeacherById,
  onOpenRateModal,
}) => {
  const { watchlist, toggleWatchlist, compareList, toggleCompare } = useLecturePulse();
  const isBookmarked = watchlist.includes(lecture.id);
  const isCompared = compareList.includes(lecture.id);

  // Pacing descriptor
  const getPacingLabel = (val: number) => {
    if (val >= 4.2) return 'Fast paced';
    if (val <= 2.2) return 'Slow paced';
    return 'Balanced pace';
  };

  // Difficulty descriptor
  const getDifficultyLabel = (val: number) => {
    if (val >= 4.3) return 'High rigor';
    if (val <= 2.5) return 'Gentle';
    return 'Moderate rigor';
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      <div>
        {/* Unboxed 1-line kicker metadata */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">{lecture.courseCode}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>Lecture {lecture.lectureNumber.toString().padStart(2, '0')}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{lecture.durationMinutes} min</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="hidden sm:inline">{lecture.semester}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleCompare(lecture.id)}
              className={`text-xs px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                isCompared
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title="Add to side-by-side comparison"
            >
              <Scale className="w-3 h-3" />
              <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleWatchlist(lecture.id)}
              className={`p-1 rounded transition-colors ${
                isBookmarked
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
              }`}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Primary Lecture Title */}
        <h3
          onClick={() => onSelectLecture(lecture)}
          className="text-base font-bold text-neutral-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors mb-2"
        >
          {lecture.title}
        </h3>

        {/* Professor clickable link */}
        <div className="flex items-center gap-2 text-xs text-neutral-600 mb-3.5">
          <span>Delivered by</span>
          <button
            onClick={() => onSelectTeacherById(lecture.professorId)}
            className="font-medium text-neutral-900 hover:text-blue-600 underline decoration-neutral-300 hover:decoration-blue-600 transition-colors"
          >
            {lecture.professorName}
          </button>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <span>{lecture.hallRoom}</span>
        </div>

        {/* Overall Rating & Review Volume */}
        <div className="flex items-baseline justify-between py-2 border-y border-neutral-100 mb-3.5">
          <div className="flex items-center gap-2">
            <RatingStars rating={lecture.ratings.overall} size="md" />
            <span className="font-mono text-base font-bold text-neutral-900 tabular-nums">
              {lecture.ratings.overall.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-400">/ 5.0</span>
          </div>
          <span className="text-xs font-mono tabular-nums text-neutral-500">
            {lecture.ratings.totalRatingsCount} student evaluations
          </span>
        </div>

        {/* Metric indicators - unboxed multi-dimensional telemetry */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-3.5 pt-1">
          <div className="bg-neutral-50 p-2 rounded-lg">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Clarity</span>
            <span className="font-mono font-semibold tabular-nums text-neutral-900">
              {lecture.ratings.clarity.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="bg-neutral-50 p-2 rounded-lg">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Pacing</span>
            <span className="font-mono font-semibold tabular-nums text-neutral-900">
              {lecture.ratings.pacing.toFixed(1)} <span className="text-[10px] text-neutral-500 font-normal">({getPacingLabel(lecture.ratings.pacing)})</span>
            </span>
          </div>
          <div className="bg-neutral-50 p-2 rounded-lg">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Difficulty</span>
            <span className="font-mono font-semibold tabular-nums text-neutral-900">
              {lecture.ratings.difficulty.toFixed(1)} <span className="text-[10px] text-neutral-500 font-normal">({getDifficultyLabel(lecture.ratings.difficulty)})</span>
            </span>
          </div>
        </div>

        {/* Alert and Focus Callouts (Non-pill clean inline callouts) */}
        {(lecture.alertFlags.isDifficultyAlert || lecture.alertFlags.isExamPrepCritical) && (
          <div className="text-xs mb-3.5 space-y-1">
            {lecture.alertFlags.isExamPrepCritical && (
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded-md">
                <Award className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span className="font-medium">Exam Essential: Ranked high priority for midterm review</span>
              </div>
            )}
            {lecture.alertFlags.isDifficultyAlert && (
              <div className="flex items-center gap-1.5 text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-neutral-600" />
                <span>Concept Rigor: Students recommend reviewing slide proofs beforehand</span>
              </div>
            )}
          </div>
        )}

        {/* Unboxed tags */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 mb-4">
          <span className="text-neutral-400 text-[11px]">Keywords:</span>
          {lecture.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              <span className="text-neutral-700">{tag}</span>
              {idx < lecture.tags.length - 1 && <span aria-hidden="true" className="text-neutral-300">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          {lecture.slidesAvailable && (
            <span className="flex items-center gap-1 text-neutral-600">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Slides</span>
            </span>
          )}
          {lecture.recordingAvailable && (
            <span className="flex items-center gap-1 text-neutral-600">
              <Video className="w-3.5 h-3.5 text-neutral-400" />
              <span>Video</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenRateModal(lecture)}
            className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
          >
            Rate
          </button>
          <button
            onClick={() => onSelectLecture(lecture)}
            className="text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Breakdown & Reviews</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
