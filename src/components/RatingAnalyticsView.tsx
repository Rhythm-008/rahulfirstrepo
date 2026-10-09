import React from 'react';
import { Award, AlertTriangle, TrendingUp, BarChart3, Clock, ArrowRight } from 'lucide-react';
import { useLecturePulse } from '../context/LecturePulseContext';
import { RatingStars } from './RatingStars';
import { Lecture } from '../types';

interface RatingAnalyticsViewProps {
  onSelectLecture: (lecture: Lecture) => void;
  onSelectTeacherById: (teacherId: string) => void;
}

export const RatingAnalyticsView: React.FC<RatingAnalyticsViewProps> = ({
  onSelectLecture,
  onSelectTeacherById,
}) => {
  const { lectures, teachers } = useLecturePulse();

  // Sortings for analytics
  const topRated = [...lectures].sort((a, b) => b.ratings.overall - a.ratings.overall);
  const mostDifficult = [...lectures].sort((a, b) => b.ratings.difficulty - a.ratings.difficulty);
  const fastestPaced = [...lectures].sort((a, b) => b.ratings.pacing - a.ratings.pacing);
  const examCritical = [...lectures].sort((a, b) => b.ratings.examRelevance - a.ratings.examRelevance);

  // Department averages
  const deptMap: Record<string, { count: number; totalRating: number; totalDiff: number }> = {};
  lectures.forEach((l) => {
    if (!deptMap[l.department]) {
      deptMap[l.department] = { count: 0, totalRating: 0, totalDiff: 0 };
    }
    deptMap[l.department].count += 1;
    deptMap[l.department].totalRating += l.ratings.overall;
    deptMap[l.department].totalDiff += l.ratings.difficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Campus Lecture Rating Analytics & Monitoring Radar
        </h1>
        <p className="text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed">
          Aggregated peer telemetry across campus lecture halls. Use these metrics to prioritize study hours, identify difficult concept lectures, and prepare for exams.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Lectures Monitored
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {lectures.length}
            </span>
            <span className="text-xs text-neutral-500">across 5 departments</span>
          </div>
          <span className="text-xs text-neutral-600 mt-2 block">
            {lectures.reduce((acc, l) => acc + l.ratings.totalRatingsCount, 0)} total peer evaluations logged
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Exam Critical Flagged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {lectures.filter((l) => l.alertFlags.isExamPrepCritical).length}
            </span>
            <span className="text-xs text-neutral-500">lectures</span>
          </div>
          <span className="text-xs text-neutral-600 mt-2 block">
            Rated $\ge 4.7$ exam relevance by enrolled students
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
            Faculty Mentors Tracked
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-neutral-900 tabular-nums">
              {teachers.length}
            </span>
            <span className="text-xs text-neutral-500">professors</span>
          </div>
          <span className="text-xs text-neutral-600 mt-2 block">
            {teachers.reduce((acc, t) => acc + t.studentComments.length, 0)} insider tips on office hours & research
          </span>
        </div>
      </div>

      {/* Grid of Analytical Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard 1: Highest Student Satisfaction */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Highest-Rated Lectures Campus-Wide</h2>
              <span className="text-xs text-neutral-500">Exceptional clarity & conceptual presentation</span>
            </div>
          </div>

          <div className="space-y-3">
            {topRated.slice(0, 4).map((lec, idx) => (
              <div
                key={lec.id}
                onClick={() => onSelectLecture(lec)}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-neutral-400 group-hover:text-neutral-900 w-4 pt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {lec.courseCode}: {lec.title}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5">
                      <span>{lec.professorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Clarity: {lec.ratings.clarity.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-neutral-900 tabular-nums text-sm">
                    ★ {lec.ratings.overall.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {lec.ratings.totalRatingsCount} reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard 2: High Rigor / Difficult Concept Alert */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100">
            <AlertTriangle className="w-5 h-5 text-neutral-700" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">High Rigor & Steep Learning Curve Radar</h2>
              <span className="text-xs text-neutral-500">Lectures students advise allocating extra study time for</span>
            </div>
          </div>

          <div className="space-y-3">
            {mostDifficult.slice(0, 4).map((lec, idx) => (
              <div
                key={lec.id}
                onClick={() => onSelectLecture(lec)}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-neutral-400 group-hover:text-neutral-900 w-4 pt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {lec.courseCode}: {lec.title}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5">
                      <span>{lec.professorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Pacing: {lec.ratings.pacing.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-neutral-900 tabular-nums text-sm">
                    {lec.ratings.difficulty.toFixed(1)} / 5.0
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Difficulty Index
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Comparative Breakdown */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
          Department-Level Rating Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {Object.entries(deptMap).map(([dept, data]) => {
            const avgRating = (data.totalRating / data.count).toFixed(1);
            const avgDiff = (data.totalDiff / data.count).toFixed(1);

            return (
              <div key={dept} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <span className="font-bold text-neutral-900 block truncate mb-1">
                  {dept}
                </span>
                <span className="text-[11px] text-neutral-500 block mb-2">
                  {data.count} {data.count === 1 ? 'lecture' : 'lectures'} tracked
                </span>

                <div className="space-y-1 pt-2 border-t border-neutral-200/60">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Avg Rating:</span>
                    <span className="font-mono font-bold text-neutral-900">★ {avgRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Avg Rigor:</span>
                    <span className="font-mono font-bold text-neutral-900">{avgDiff} / 5</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
