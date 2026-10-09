import React, { useState } from 'react';
import { X, Check, Award, AlertCircle, Lightbulb } from 'lucide-react';
import { Lecture } from '../types';
import { RatingStars } from './RatingStars';
import { useLecturePulse } from '../context/LecturePulseContext';

interface SubmitLectureReviewModalProps {
  lecture: Lecture | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitLectureReviewModal: React.FC<SubmitLectureReviewModalProps> = ({
  lecture,
  isOpen,
  onClose,
}) => {
  const { addLectureReview, student, lectures } = useLecturePulse();

  const [selectedLectureId, setSelectedLectureId] = useState(lecture?.id || lectures[0]?.id || '');
  const [overallRating, setOverallRating] = useState(5);
  const [clarityRating, setClarityRating] = useState(5);
  const [pacingRating, setPacingRating] = useState(3);
  const [difficultyRating, setDifficultyRating] = useState(4);
  const [engagementRating, setEngagementRating] = useState(5);
  const [materialsRating, setMaterialsRating] = useState(5);
  const [examRelevanceRating, setExamRelevanceRating] = useState(5);
  const [attendanceMode, setAttendanceMode] = useState<'In-Person Hall' | '1.5x Recording' | 'Live Stream'>('In-Person Hall');
  const [reviewText, setReviewText] = useState('');
  const [studentTip, setStudentTip] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync if lecture changes
  React.useEffect(() => {
    if (lecture?.id) {
      setSelectedLectureId(lecture.id);
    }
  }, [lecture]);

  if (!isOpen) return null;

  const currentLecture = lectures.find((l) => l.id === selectedLectureId) || lecture;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLectureId || !reviewText.trim()) return;

    addLectureReview({
      lectureId: selectedLectureId,
      studentHandle: student.handle,
      isAnonymous,
      attendanceMode,
      overallRating,
      clarityRating,
      pacingRating,
      difficultyRating,
      engagementRating,
      materialsRating,
      examRelevanceRating,
      reviewText: reviewText.trim(),
      studentTip: studentTip.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setReviewText('');
      setStudentTip('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs text-neutral-500 font-medium">Peer Evaluation Form</span>
            <h3 className="text-lg font-bold text-neutral-900">
              Submit Lecture Rating & Feedback
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Your evaluation directly updates pacing metrics and exam alerts for other students.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">Evaluation Recorded!</h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Thank you for contributing to campus lecture transparency. The lecture telemetry has been updated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Target Lecture Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Select Lecture
              </label>
              <select
                value={selectedLectureId}
                onChange={(e) => setSelectedLectureId(e.target.value)}
                className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium text-neutral-900"
              >
                {lectures.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.courseCode} L{l.lectureNumber.toString().padStart(2, '0')}: {l.title} ({l.professorName})
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Mode */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                How did you attend?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['In-Person Hall', '1.5x Recording', 'Live Stream'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setAttendanceMode(mode)}
                    className={`py-2 px-3 rounded-lg text-center border font-medium transition-all ${
                      attendanceMode === mode
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratings Sliders / Values Grid */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <span className="text-xs font-bold text-neutral-900 block">
                Lecture Evaluation Dimensions
              </span>

              {/* Overall Star Rating */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-200/60">
                <span className="font-semibold text-neutral-900">Overall Lecture Rating:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={overallRating} interactive onRatingChange={setOverallRating} size="md" />
                  <span className="font-mono tabular-nums font-bold w-6 text-right">{overallRating}.0</span>
                </div>
              </div>

              {/* Clarity */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Explanation Clarity:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={clarityRating} interactive onRatingChange={setClarityRating} size="sm" />
                  <span className="font-mono tabular-nums w-4 text-right">{clarityRating}</span>
                </div>
              </div>

              {/* Pacing Slider */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700">Lecture Pace:</span>
                  <span className="font-medium text-neutral-900">
                    {pacingRating === 1 && '1 - Too Slow'}
                    {pacingRating === 2 && '2 - Leisurely'}
                    {pacingRating === 3 && '3 - Ideal / Balanced'}
                    {pacingRating === 4 && '4 - Fast Paced'}
                    {pacingRating === 5 && '5 - Blistering / Rushed'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={pacingRating}
                  onChange={(e) => setPacingRating(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>

              {/* Difficulty Slider */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700">Concept Difficulty / Rigor:</span>
                  <span className="font-medium text-neutral-900">
                    {difficultyRating === 1 && '1 - Elementary'}
                    {difficultyRating === 2 && '2 - Accessible'}
                    {difficultyRating === 3 && '3 - Moderate'}
                    {difficultyRating === 4 && '4 - Challenging'}
                    {difficultyRating === 5 && '5 - Highly Rigorous'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={difficultyRating}
                  onChange={(e) => setDifficultyRating(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>

              {/* Exam Relevance */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Exam / Problem Set Alignment:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={examRelevanceRating} interactive onRatingChange={setExamRelevanceRating} size="sm" />
                  <span className="font-mono tabular-nums w-4 text-right">{examRelevanceRating}</span>
                </div>
              </div>
            </div>

            {/* Detailed Commentary */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Review & Critique <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your thoughts on the derivations, whiteboard clarity, or topic flow..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
            </div>

            {/* Peer Study Tip */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-neutral-900 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Actionable Tip for Classmates</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 'Pause at 38:00 to sketch the diagram', 'Review Lemma 4.1 first'"
                value={studentTip}
                onChange={(e) => setStudentTip(e.target.value)}
                className="w-full p-2 text-xs bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-400"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900"
                />
                <span>Submit anonymously</span>
              </label>

              {!isAnonymous && (
                <span className="text-[11px] text-neutral-500 font-mono">
                  Posting as {student.handle}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
              >
                Post Evaluation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
