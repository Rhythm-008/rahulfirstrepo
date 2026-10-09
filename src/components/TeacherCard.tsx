import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  MessageSquarePlus, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Lightbulb, 
  GraduationCap,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TeacherProfile, TeacherStudentComment } from '../types';
import { RatingStars } from './RatingStars';
import { useLecturePulse } from '../context/LecturePulseContext';

interface TeacherCardProps {
  teacher: TeacherProfile;
  onOpenAddCommentModal: (teacher: TeacherProfile) => void;
  onViewTeacherLectures: (teacherId: string) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onOpenAddCommentModal,
  onViewTeacherLectures,
}) => {
  const { upvoteTeacherComment } = useLecturePulse();
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);
  const [selectedCommentFilter, setSelectedCommentFilter] = useState<string>('All');

  const filteredComments = selectedCommentFilter === 'All'
    ? teacher.studentComments
    : teacher.studentComments.filter((c) => c.category === selectedCommentFilter);

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
      {/* Top Header Zone */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-800">{teacher.department}</span>
            <span aria-hidden="true">·</span>
            <span>{teacher.title}</span>
          </div>

          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            {teacher.name}
          </h2>

          <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            {teacher.bio}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{teacher.officeRoom}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{teacher.officeHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{teacher.email}</span>
            </div>
          </div>
        </div>

        {/* Aggregated Student Rating Scorecard */}
        <div className="flex md:flex-col items-center md:items-end justify-between bg-neutral-50 md:bg-transparent p-3 md:p-0 rounded-lg">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-extrabold text-neutral-900 tabular-nums">
              {teacher.metrics.overallRating.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
            <RatingStars rating={teacher.metrics.overallRating} size="sm" />
            <span className="font-mono tabular-nums ml-1 font-semibold text-neutral-700">
              {teacher.metrics.wouldTakeAgainPercentage}%
            </span>
            <span>would take again</span>
          </div>
          <button
            onClick={() => onOpenAddCommentModal(teacher)}
            className="mt-3 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-neutral-700" />
            <span>Add Advice on Professor</span>
          </button>
        </div>
      </div>

      {/* 4 Dimension Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-neutral-100 text-xs">
        <div className="bg-neutral-50/70 p-2.5 rounded-lg">
          <span className="text-[11px] text-neutral-500 block mb-0.5">Approachability</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold tabular-nums text-neutral-900">
              {teacher.metrics.approachability.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-neutral-500">
              {teacher.metrics.approachability >= 4.5 ? 'Very Warm' : 'Standard'}
            </span>
          </div>
        </div>

        <div className="bg-neutral-50/70 p-2.5 rounded-lg">
          <span className="text-[11px] text-neutral-500 block mb-0.5">Teaching Clarity</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold tabular-nums text-neutral-900">
              {teacher.metrics.clarity.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-neutral-500">
              {teacher.metrics.clarity >= 4.7 ? 'Exceptional' : 'Solid'}
            </span>
          </div>
        </div>

        <div className="bg-neutral-50/70 p-2.5 rounded-lg">
          <span className="text-[11px] text-neutral-500 block mb-0.5">Helpfulness</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold tabular-nums text-neutral-900">
              {teacher.metrics.helpfulness.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-neutral-500">In Office Hours</span>
          </div>
        </div>

        <div className="bg-neutral-50/70 p-2.5 rounded-lg">
          <span className="text-[11px] text-neutral-500 block mb-0.5">Grading Fairness</span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold tabular-nums text-neutral-900">
              {teacher.metrics.gradingFairness.toFixed(1)} / 5.0
            </span>
            <span className="text-[10px] text-neutral-500">Transparent Rubrics</span>
          </div>
        </div>
      </div>

      {/* Courses Taught by this Professor */}
      <div className="py-3 flex flex-wrap items-center gap-2 text-xs border-b border-neutral-100">
        <span className="text-neutral-500 font-medium">Courses Taught:</span>
        {teacher.coursesTaught.map((c) => (
          <button
            key={c.code}
            onClick={() => onViewTeacherLectures(teacher.id)}
            className="text-neutral-800 hover:text-blue-600 font-medium hover:underline transition-colors flex items-center gap-1"
          >
            <span>{c.code} ({c.name})</span>
            {c.currentSemester && (
              <span className="text-[10px] text-neutral-500 font-normal">[Active]</span>
            )}
          </button>
        ))}
      </div>

      {/* Student Field Guide: "How to Get Known to this Teacher" */}
      <div className="mt-4 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-neutral-900">
              Student Guide: How to Get Known & Succeed with {teacher.name.split(' ')[0]} {teacher.name.split(' ')[1]}
            </h4>
          </div>
          <button
            onClick={() => setIsGuideExpanded(!isGuideExpanded)}
            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            <span>{isGuideExpanded ? 'Collapse Guide' : 'Expand Guide'}</span>
            {isGuideExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isGuideExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100 text-xs mb-5">
            <div className="space-y-1">
              <span className="font-semibold text-neutral-900 block">
                Office Hours Best Practice
              </span>
              <p className="text-neutral-600 leading-relaxed">
                {teacher.howToGetKnownGuide.bestOfficeHoursApproach}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-neutral-900 block">
                Classroom Participation & Recognition
              </span>
              <p className="text-neutral-600 leading-relaxed">
                {teacher.howToGetKnownGuide.classroomParticipationTip}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-neutral-900 block">
                Research Opportunities & Letters of Rec
              </span>
              <p className="text-neutral-600 leading-relaxed">
                {teacher.howToGetKnownGuide.researchOpportunityAdvice}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-neutral-900 block">
                Email Etiquette & Response Habits
              </span>
              <p className="text-neutral-600 leading-relaxed">
                {teacher.howToGetKnownGuide.recommendedEmailEtiquette}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Student Comments & Advice Feed */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-neutral-900">
              Student Peer Advice & Insider Comments
            </h4>
            <span className="text-xs font-mono tabular-nums text-neutral-500">
              ({teacher.studentComments.length} contributions)
            </span>
          </div>

          {/* Functional category filter segmented buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs">
            {['All', 'How to Approach', 'Office Hours', 'Teaching Style', 'Mentorship & Research'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCommentFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                  selectedCommentFilter === cat
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredComments.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            <p className="text-xs text-neutral-500 mb-2">No comments in this category yet.</p>
            <button
              onClick={() => onOpenAddCommentModal(teacher)}
              className="text-xs font-semibold text-neutral-900 underline"
            >
              Be the first student to add advice
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-neutral-50/60 border border-neutral-200/80 rounded-lg p-3.5 text-xs"
              >
                {/* Comment Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <span className="font-semibold text-neutral-900">
                      {comment.isAnonymous ? 'Anonymous Student' : comment.studentHandle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Course: {comment.courseTaken}</span>
                    <span aria-hidden="true">·</span>
                    <span>{comment.semesterTaken}</span>
                    {comment.gradeReceived && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-neutral-700 font-mono">Grade: {comment.gradeReceived}</span>
                      </>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    {comment.category}
                  </span>
                </div>

                {/* Comment Body */}
                <p className="text-neutral-700 leading-relaxed mb-2.5">
                  {comment.comment}
                </p>

                {/* Actionable Insider Tip Highlight */}
                {comment.insiderTip && (
                  <div className="bg-amber-50/80 border border-amber-200/60 rounded-md p-2.5 mb-2.5 text-amber-900 leading-relaxed">
                    <div className="flex items-center gap-1 font-semibold text-[11px] text-amber-800 mb-0.5">
                      <Lightbulb className="w-3 h-3 text-amber-600" />
                      <span>Insider Advice for Future Students:</span>
                    </div>
                    <p className="text-neutral-800 text-xs">
                      {comment.insiderTip}
                    </p>
                  </div>
                )}

                {/* Comment Footer & Upvote */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span>Approachability: {comment.ratings.approachability}/5</span>
                    <span aria-hidden="true">·</span>
                    <span>Fairness: {comment.ratings.fairness}/5</span>
                  </div>

                  <button
                    onClick={() => upvoteTeacherComment(teacher.id, comment.id)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                      comment.userUpvoted
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="font-mono tabular-nums">{comment.upvotes}</span>
                    <span className="hidden sm:inline">found helpful</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
