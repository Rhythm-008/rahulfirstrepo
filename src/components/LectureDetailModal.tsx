import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Scale, 
  ThumbsUp, 
  FileText, 
  Video, 
  Award, 
  AlertCircle, 
  Lightbulb, 
  Clock, 
  MapPin, 
  PlusCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Lecture } from '../types';
import { RatingStars } from './RatingStars';
import { useLecturePulse } from '../context/LecturePulseContext';

interface LectureDetailModalProps {
  lecture: Lecture | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTeacherById: (teacherId: string) => void;
  onOpenRateModal: (lecture: Lecture) => void;
}

export const LectureDetailModal: React.FC<LectureDetailModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onSelectTeacherById,
  onOpenRateModal,
}) => {
  const { reviews, upvoteLectureReview, watchlist, toggleWatchlist, compareList, toggleCompare } = useLecturePulse();

  if (!isOpen || !lecture) return null;

  const lectureReviews = reviews[lecture.id] || [];
  const isBookmarked = watchlist.includes(lecture.id);
  const isCompared = compareList.includes(lecture.id);

  // Compute distribution percentages
  const dist = lecture.ratings.ratingDistribution;
  const totalReviews = lecture.ratings.totalRatingsCount || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 p-5 sm:p-7">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span className="font-semibold text-neutral-900">{lecture.courseCode}</span>
              <span aria-hidden="true">·</span>
              <span>{lecture.courseName}</span>
              <span aria-hidden="true">·</span>
              <span>Lecture {lecture.lectureNumber.toString().padStart(2, '0')}</span>
              <span aria-hidden="true">·</span>
              <span>{lecture.semester}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
              {lecture.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-2">
              <div className="flex items-center gap-1.5">
                <span>Instructor:</span>
                <button
                  onClick={() => {
                    onClose();
                    onSelectTeacherById(lecture.professorId);
                  }}
                  className="font-medium text-blue-600 hover:text-blue-800 underline flex items-center gap-0.5"
                >
                  <span>{lecture.professorName}</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </button>
              </div>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{lecture.hallRoom}</span>
              </div>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <div className="flex items-center gap-1 text-neutral-500">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{lecture.durationMinutes} min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleCompare(lecture.id)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Toggle comparison"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleWatchlist(lecture.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-100'
              }`}
              title="Bookmark in study queue"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts & Critical Flags Banner */}
        {(lecture.alertFlags.isDifficultyAlert || lecture.alertFlags.isExamPrepCritical || lecture.alertFlags.isPacingWarning) && (
          <div className="my-4 p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5 text-xs">
            {lecture.alertFlags.isExamPrepCritical && (
              <div className="flex items-center gap-2 text-amber-800">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">
                  Exam Essential: 94% of past students marked this lecture as a primary source for exam questions.
                </span>
              </div>
            )}
            {lecture.alertFlags.isDifficultyAlert && (
              <div className="flex items-center gap-2 text-neutral-800">
                <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                <span>
                  High Rigor Alert: Heavy mathematical derivations and proofs. Classmates suggest reviewing foundational slides first.
                </span>
              </div>
            )}
            {lecture.alertFlags.isPacingWarning && (
              <div className="flex items-center gap-2 text-neutral-700">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>
                  Fast Delivery: Multiple student reviews note rapid progression near the end of the lecture.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Rating Metrics & Scorecard Section */}
        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-neutral-50/70 rounded-xl border border-neutral-200">
          {/* Left Column: Overall score & Star breakdown */}
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-3xl font-extrabold text-neutral-900 tabular-nums">
                {lecture.ratings.overall.toFixed(1)}
              </span>
              <div className="space-y-0.5">
                <RatingStars rating={lecture.ratings.overall} size="md" />
                <span className="text-xs text-neutral-500 font-mono block">
                  Based on {lecture.ratings.totalRatingsCount} student evaluations
                </span>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="space-y-1 text-xs mt-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = dist[stars as keyof typeof dist] || 0;
                const pct = Math.round((count / totalReviews) * 100);
                return (
                  <div key={stars} className="flex items-center gap-2 text-neutral-600">
                    <span className="font-mono tabular-nums w-4 text-right text-xs">{stars}★</span>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono tabular-nums text-[11px] text-neutral-500 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Multi-Dimensional Metrics Bar */}
          <div className="space-y-2.5 text-xs">
            <span className="font-bold text-neutral-900 block text-xs">
              Evaluation Dimensions
            </span>

            <div>
              <div className="flex justify-between text-neutral-700 mb-1">
                <span>Explanation Clarity</span>
                <span className="font-mono font-semibold tabular-nums">{lecture.ratings.clarity.toFixed(1)} / 5.0</span>
              </div>
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${(lecture.ratings.clarity / 5) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-700 mb-1">
                <span>Pacing (3.0 = Ideal)</span>
                <span className="font-mono font-semibold tabular-nums">{lecture.ratings.pacing.toFixed(1)} / 5.0</span>
              </div>
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${(lecture.ratings.pacing / 5) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-700 mb-1">
                <span>Difficulty / Rigor</span>
                <span className="font-mono font-semibold tabular-nums">{lecture.ratings.difficulty.toFixed(1)} / 5.0</span>
              </div>
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${(lecture.ratings.difficulty / 5) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-700 mb-1">
                <span>Exam Alignment & Value</span>
                <span className="font-mono font-semibold tabular-nums">{lecture.ratings.examRelevance.toFixed(1)} / 5.0</span>
              </div>
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${(lecture.ratings.examRelevance / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways & Syllabus Summary */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-neutral-900 mb-2">
            Key Syllabus Concepts Covered
          </h4>
          <ul className="space-y-1.5 text-xs text-neutral-700">
            {lecture.summaryKeyTakeaways.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-neutral-400 font-mono text-[11px] mt-0.5">•</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Semester Trendline Context */}
        {lecture.trendHistory && lecture.trendHistory.length > 0 && (
          <div className="mb-6 p-4 bg-white border border-neutral-200 rounded-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-neutral-900">Course Rating Progression ({lecture.courseCode})</span>
              <span className="text-neutral-500 font-mono">Rating vs Difficulty</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {lecture.trendHistory.map((item) => (
                <div
                  key={item.label}
                  className={`p-2.5 rounded-lg border text-xs text-center ${
                    item.lectureNum === lecture.lectureNumber
                      ? 'border-neutral-900 bg-neutral-50 font-semibold'
                      : 'border-neutral-100 bg-neutral-50/50'
                  }`}
                >
                  <span className="block text-neutral-500 text-[11px]">{item.label}</span>
                  <div className="font-mono font-bold text-neutral-900 mt-1">
                    ★ {item.rating.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-neutral-500 block">
                    Diff: {item.difficulty.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Reviews & Peer Advice */}
        <div className="mt-6 pt-5 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Student Feedback & Field Tips
              </h4>
              <span className="text-xs text-neutral-500">
                {lectureReviews.length} student reviews recorded
              </span>
            </div>

            <button
              onClick={() => onOpenRateModal(lecture)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit My Review</span>
            </button>
          </div>

          {lectureReviews.length === 0 ? (
            <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
              <p className="text-xs text-neutral-500 mb-2">No individual comments for this lecture yet.</p>
              <button
                onClick={() => onOpenRateModal(lecture)}
                className="text-xs font-semibold text-neutral-900 underline"
              >
                Be the first to review this lecture
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {lectureReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-neutral-50/60 border border-neutral-200/80 rounded-lg p-3.5 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span className="font-semibold text-neutral-900">
                        {rev.isAnonymous ? 'Anonymous Student' : rev.studentHandle}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-[11px] text-neutral-700 font-medium">
                        {rev.attendanceMode}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={rev.overallRating} size="sm" />
                      <span className="font-mono tabular-nums font-semibold text-neutral-800">
                        {rev.overallRating}.0
                      </span>
                    </div>
                  </div>

                  <p className="text-neutral-700 leading-relaxed">
                    {rev.reviewText}
                  </p>

                  {rev.studentTip && (
                    <div className="bg-amber-50/70 border border-amber-200/50 rounded-md p-2 text-amber-900">
                      <div className="flex items-center gap-1 font-semibold text-[11px] text-amber-800 mb-0.5">
                        <Lightbulb className="w-3 h-3 text-amber-600" />
                        <span>Peer Study Tip:</span>
                      </div>
                      <p className="text-xs text-neutral-800">
                        {rev.studentTip}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span>Clarity: {rev.clarityRating}/5</span>
                      <span aria-hidden="true">·</span>
                      <span>Difficulty: {rev.difficultyRating}/5</span>
                    </div>

                    <button
                      onClick={() => upvoteLectureReview(lecture.id, rev.id)}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${
                        rev.userUpvoted
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span className="font-mono tabular-nums">{rev.upvotes}</span>
                      <span className="hidden sm:inline">helpful</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
