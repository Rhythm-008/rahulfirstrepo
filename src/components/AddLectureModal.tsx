import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useLecturePulse } from '../context/LecturePulseContext';

interface AddLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLectureModal: React.FC<AddLectureModalProps> = ({ isOpen, onClose }) => {
  const { addNewLecture, teachers } = useLecturePulse();

  const [courseCode, setCourseCode] = useState('CS201');
  const [courseName, setCourseName] = useState('Data Structures & Algorithms');
  const [lectureNumber, setLectureNumber] = useState<number>(9);
  const [title, setTitle] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('Fall 2026');
  const [date, setDate] = useState('2026-10-09');
  const [durationMinutes, setDurationMinutes] = useState(75);
  const [hallRoom, setHallRoom] = useState('Turing Hall 101');
  const [tagsInput, setTagsInput] = useState('Dynamic Programming, Midterm Prep');
  const [takeawayInput, setTakeawayInput] = useState('Memoization table state transitions');
  const [isExamPrep, setIsExamPrep] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim()) return;

    const teacherObj = teachers.find((t) => t.id === selectedTeacherId);
    const profName = teacherObj ? teacherObj.name : 'Faculty Instructor';

    addNewLecture({
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      lectureNumber: Number(lectureNumber),
      title: title.trim(),
      professorId: selectedTeacherId || 'prof-general',
      professorName: profName,
      department,
      semester,
      date,
      durationMinutes: Number(durationMinutes),
      hallRoom: hallRoom.trim(),
      slidesAvailable: true,
      recordingAvailable: true,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      summaryKeyTakeaways: takeawayInput.split('\n').map((t) => t.trim()).filter(Boolean),
      alertFlags: {
        isExamPrepCritical: isExamPrep,
      },
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Register Lecture for Monitoring
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Add an upcoming or past lecture to collect peer ratings and feedback.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">Lecture Registered!</h4>
            <p className="text-xs text-neutral-500">The lecture is now open for student ratings.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Course Code
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CS201"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Lecture Number
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="40"
                  value={lectureNumber}
                  onChange={(e) => setLectureNumber(Number(e.target.value))}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Lecture Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Dynamic Programming & Memoization Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Instructor
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Neuroscience & Biology">Neuroscience & Biology</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Hall / Room
                </label>
                <input
                  type="text"
                  value={hallRoom}
                  onChange={(e) => setHallRoom(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Topic Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Proofs, Graph Theory, Slides Available"
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isExamPrep}
                onChange={(e) => setIsExamPrep(e.target.checked)}
                className="rounded text-neutral-900 focus:ring-neutral-900"
              />
              <span>Mark as High-Priority Exam Prep Lecture</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-neutral-700 hover:text-neutral-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm"
              >
                Register Lecture
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
