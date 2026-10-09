import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, Check } from 'lucide-react';
import { TeacherProfile } from '../types';
import { RatingStars } from './RatingStars';
import { useLecturePulse } from '../context/LecturePulseContext';

interface SubmitTeacherCommentModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitTeacherCommentModal: React.FC<SubmitTeacherCommentModalProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  const { addTeacherComment, student } = useLecturePulse();

  const [category, setCategory] = useState<'How to Approach' | 'Teaching Style' | 'Office Hours' | 'Exams & Grading' | 'Mentorship & Research' | 'General Advice'>('How to Approach');
  const [courseTaken, setCourseTaken] = useState(teacher?.coursesTaught[0]?.code || 'CS201');
  const [semesterTaken, setSemesterTaken] = useState('Fall 2026');
  const [gradeReceived, setGradeReceived] = useState('');
  const [commentText, setCommentText] = useState('');
  const [insiderTip, setInsiderTip] = useState('');
  const [approachability, setApproachability] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [fairness, setFairness] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addTeacherComment({
      teacherId: teacher.id,
      studentHandle: student.handle,
      isAnonymous,
      courseTaken,
      semesterTaken,
      gradeReceived: gradeReceived.trim() || undefined,
      category,
      comment: commentText.trim(),
      insiderTip: insiderTip.trim(),
      ratings: {
        approachability,
        clarity,
        fairness,
      },
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset fields
      setCommentText('');
      setInsiderTip('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs text-neutral-500 font-medium mb-1">
              Student Peer Advisory
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Share Advice on {teacher.name}
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Help fellow students understand this professor's teaching style and how to connect during office hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">Thank you, {isAnonymous ? 'Student' : student.name}!</h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Your advice on {teacher.name} has been published to the student portal and will guide your peers this semester.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Advice Focus Area
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {(['How to Approach', 'Office Hours', 'Teaching Style', 'Exams & Grading', 'Mentorship & Research', 'General Advice'] as const).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      category === cat
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Course Taken
                </label>
                <select
                  value={courseTaken}
                  onChange={(e) => setCourseTaken(e.target.value)}
                  className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {teacher.coursesTaught.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                  <option value="Other">Other / Independent Study</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Semester
                </label>
                <select
                  value={semesterTaken}
                  onChange={(e) => setSemesterTaken(e.target.value)}
                  className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Fall 2026">Fall 2026 (Current)</option>
                  <option value="Spring 2026">Spring 2026</option>
                  <option value="Fall 2025">Fall 2025</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Grade (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A, A-, B+"
                  value={gradeReceived}
                  onChange={(e) => setGradeReceived(e.target.value)}
                  className="w-full text-xs p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Ratings Sliders / Values */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <span className="text-xs font-bold text-neutral-900 block">
                Professor Evaluation Criteria
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Approachability:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={approachability} interactive onRatingChange={setApproachability} size="md" />
                  <span className="font-mono tabular-nums font-semibold w-4 text-right">{approachability}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Lecture Clarity:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={clarity} interactive onRatingChange={setClarity} size="md" />
                  <span className="font-mono tabular-nums font-semibold w-4 text-right">{clarity}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-700">Grading Fairness:</span>
                <div className="flex items-center gap-2">
                  <RatingStars rating={fairness} interactive onRatingChange={setFairness} size="md" />
                  <span className="font-mono tabular-nums font-semibold w-4 text-right">{fairness}</span>
                </div>
              </div>
            </div>

            {/* General Advice Comment */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Your Observations & Perspective <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder={`Describe how ${teacher.name} conducts lectures, communicates with students, or handles questions...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 placeholder:text-neutral-400"
              />
            </div>

            {/* Practical Insider Tip Field (Core value for peers!) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Concrete Insider Tip to Get Known / Succeed</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 'Ask questions about cache hierarchies after class; she remembers students who show curiosity and offers lab positions in week 10.'"
                value={insiderTip}
                onChange={(e) => setInsiderTip(e.target.value)}
                className="w-full p-2.5 text-xs bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 placeholder:text-amber-800/50 text-neutral-900"
              />
            </div>

            {/* Identity & Anonymous Toggle */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-neutral-900"
                />
                <span>Submit as Anonymous Student</span>
              </label>

              {!isAnonymous && (
                <span className="text-[11px] text-neutral-500 font-mono">
                  Posting as {student.handle}
                </span>
              )}
            </div>

            {/* Submit Action */}
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
                Publish Advice
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
