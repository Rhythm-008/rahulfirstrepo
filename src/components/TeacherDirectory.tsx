import React, { useState } from 'react';
import { Search, Filter, MessageSquarePlus, GraduationCap, Users } from 'lucide-react';
import { TeacherProfile } from '../types';
import { TeacherCard } from './TeacherCard';
import { useLecturePulse } from '../context/LecturePulseContext';

interface TeacherDirectoryProps {
  onOpenAddCommentModal: (teacher: TeacherProfile) => void;
  onViewTeacherLectures: (teacherId: string) => void;
  selectedTeacherId?: string | null;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  onOpenAddCommentModal,
  onViewTeacherLectures,
  selectedTeacherId,
}) => {
  const { teachers } = useLecturePulse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', 'Computer Science', 'Mathematics', 'Data Science', 'Electrical Engineering', 'Neuroscience & Biology'];

  const filteredTeachers = teachers.filter((t) => {
    if (selectedTeacherId && t.id !== selectedTeacherId) return false;
    const matchesDept = selectedDept === 'All' || t.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.coursesTaught.some((c) => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Introduction Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Professor Directory & Student Insider Intel
            </h1>
            <p className="text-sm text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              Read how fellow students approach professors, navigate office hours, earn research spots, and get recognized in lecture halls.
            </p>
          </div>

          <div className="text-xs text-neutral-500 font-mono tabular-nums bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shrink-0">
            {teachers.reduce((acc, t) => acc + t.studentComments.length, 0)} student advice contributions tracked
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search professor name, course code (e.g. CS201), or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          {/* Department Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {selectedTeacherId && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-600">Showing filtered view for specific professor</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Show all professors
            </button>
          </div>
        )}
      </div>

      {/* Teachers Feed */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 p-8">
          <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-800">No professors matched your search</h3>
          <p className="text-xs text-neutral-500 mt-1">Try resetting the department filter or searching a different course code.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onOpenAddCommentModal={onOpenAddCommentModal}
              onViewTeacherLectures={onViewTeacherLectures}
            />
          ))}
        </div>
      )}
    </div>
  );
};
