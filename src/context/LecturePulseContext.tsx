import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lecture, TeacherProfile, LectureReview, TeacherStudentComment, StudentProfile } from '../types';
import { INITIAL_LECTURES, INITIAL_TEACHERS, INITIAL_LECTURE_REVIEWS, CURRENT_STUDENT } from '../data/mockData';

interface LecturePulseContextType {
  lectures: Lecture[];
  teachers: TeacherProfile[];
  reviews: Record<string, LectureReview[]>;
  watchlist: string[];
  compareList: string[];
  student: StudentProfile;
  toggleWatchlist: (lectureId: string) => void;
  toggleCompare: (lectureId: string) => void;
  removeFromCompare: (lectureId: string) => void;
  clearCompare: () => void;
  addLectureReview: (review: Omit<LectureReview, 'id' | 'date' | 'upvotes' | 'userUpvoted'>) => void;
  addTeacherComment: (comment: Omit<TeacherStudentComment, 'id' | 'date' | 'upvotes' | 'userUpvoted'>) => void;
  upvoteLectureReview: (lectureId: string, reviewId: string) => void;
  upvoteTeacherComment: (teacherId: string, commentId: string) => void;
  addNewLecture: (lecture: Omit<Lecture, 'id' | 'ratings' | 'trendHistory'>) => void;
}

const STORAGE_KEYS = {
  LECTURES: 'lecturepulse_lectures_v1',
  TEACHERS: 'lecturepulse_teachers_v1',
  REVIEWS: 'lecturepulse_reviews_v1',
  WATCHLIST: 'lecturepulse_watchlist_v1',
};

const LecturePulseContext = createContext<LecturePulseContextType | undefined>(undefined);

export const LecturePulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student] = useState<StudentProfile>(CURRENT_STUDENT);

  const [lectures, setLectures] = useState<Lecture[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LECTURES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LECTURES;
  });

  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TEACHERS;
  });

  const [reviews, setReviews] = useState<Record<string, LectureReview[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LECTURE_REVIEWS;
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['lec-cs201-07', 'lec-data204-06'];
  });

  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LECTURES, JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (lectureId: string) => {
    setWatchlist((prev) =>
      prev.includes(lectureId) ? prev.filter((id) => id !== lectureId) : [...prev, lectureId]
    );
  };

  const toggleCompare = (lectureId: string) => {
    setCompareList((prev) => {
      if (prev.includes(lectureId)) {
        return prev.filter((id) => id !== lectureId);
      }
      if (prev.length >= 3) {
        // Replace oldest or keep max 3
        return [...prev.slice(1), lectureId];
      }
      return [...prev, lectureId];
    });
  };

  const removeFromCompare = (lectureId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== lectureId));
  };

  const clearCompare = () => setCompareList([]);

  const addLectureReview = (newReviewData: Omit<LectureReview, 'id' | 'date' | 'upvotes' | 'userUpvoted'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newReview: LectureReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: today,
      upvotes: 0,
      userUpvoted: false,
    };

    setReviews((prev) => {
      const currentReviews = prev[newReview.lectureId] || [];
      return {
        ...prev,
        [newReview.lectureId]: [newReview, ...currentReviews],
      };
    });

    // Update lecture ratings mathematically
    setLectures((prevLectures) =>
      prevLectures.map((lec) => {
        if (lec.id !== newReview.lectureId) return lec;
        const currentCount = lec.ratings.totalRatingsCount;
        const newCount = currentCount + 1;

        const updatedOverall = Number(
          ((lec.ratings.overall * currentCount + newReview.overallRating) / newCount).toFixed(1)
        );
        const updatedClarity = Number(
          ((lec.ratings.clarity * currentCount + newReview.clarityRating) / newCount).toFixed(1)
        );
        const updatedDifficulty = Number(
          ((lec.ratings.difficulty * currentCount + newReview.difficultyRating) / newCount).toFixed(1)
        );
        const updatedPacing = Number(
          ((lec.ratings.pacing * currentCount + newReview.pacingRating) / newCount).toFixed(1)
        );

        const roundedStar = Math.min(5, Math.max(1, Math.round(newReview.overallRating))) as 1 | 2 | 3 | 4 | 5;
        const updatedDist = {
          ...lec.ratings.ratingDistribution,
          [roundedStar]: (lec.ratings.ratingDistribution[roundedStar] || 0) + 1,
        };

        return {
          ...lec,
          ratings: {
            ...lec.ratings,
            overall: updatedOverall,
            clarity: updatedClarity,
            difficulty: updatedDifficulty,
            pacing: updatedPacing,
            totalRatingsCount: newCount,
            ratingDistribution: updatedDist,
          },
        };
      })
    );
  };

  const addTeacherComment = (newCommentData: Omit<TeacherStudentComment, 'id' | 'date' | 'upvotes' | 'userUpvoted'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newComment: TeacherStudentComment = {
      ...newCommentData,
      id: `tc-${Date.now()}`,
      date: today,
      upvotes: 0,
      userUpvoted: false,
    };

    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) => {
        if (teacher.id !== newComment.teacherId) return teacher;
        const updatedComments = [newComment, ...teacher.studentComments];
        const newTotal = teacher.metrics.totalStudentComments + 1;

        // update approachability and clarity if rated
        const updatedApproachable = Number(
          ((teacher.metrics.approachability * teacher.metrics.totalStudentComments + newComment.ratings.approachability) / newTotal).toFixed(1)
        );
        const updatedClarity = Number(
          ((teacher.metrics.clarity * teacher.metrics.totalStudentComments + newComment.ratings.clarity) / newTotal).toFixed(1)
        );

        return {
          ...teacher,
          studentComments: updatedComments,
          metrics: {
            ...teacher.metrics,
            totalStudentComments: newTotal,
            approachability: updatedApproachable,
            clarity: updatedClarity,
          },
        };
      })
    );
  };

  const upvoteLectureReview = (lectureId: string, reviewId: string) => {
    setReviews((prev) => {
      const list = prev[lectureId] || [];
      return {
        ...prev,
        [lectureId]: list.map((rev) => {
          if (rev.id !== reviewId) return rev;
          const userAlreadyUpvoted = !!rev.userUpvoted;
          return {
            ...rev,
            upvotes: userAlreadyUpvoted ? rev.upvotes - 1 : rev.upvotes + 1,
            userUpvoted: !userAlreadyUpvoted,
          };
        }),
      };
    });
  };

  const upvoteTeacherComment = (teacherId: string, commentId: string) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;
        return {
          ...teacher,
          studentComments: teacher.studentComments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const userAlreadyUpvoted = !!comment.userUpvoted;
            return {
              ...comment,
              upvotes: userAlreadyUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
              userUpvoted: !userAlreadyUpvoted,
            };
          }),
        };
      })
    );
  };

  const addNewLecture = (lectureData: Omit<Lecture, 'id' | 'ratings' | 'trendHistory'>) => {
    const newLec: Lecture = {
      ...lectureData,
      id: `lec-${Date.now()}`,
      ratings: {
        overall: 4.5,
        clarity: 4.5,
        pacing: 3.0,
        difficulty: 3.5,
        engagement: 4.5,
        materialsQuality: 4.5,
        examRelevance: 4.5,
        totalRatingsCount: 1,
        ratingDistribution: {
          5: 1,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      },
      trendHistory: [
        { lectureNum: lectureData.lectureNumber, label: `L${lectureData.lectureNumber}`, rating: 4.5, difficulty: 3.5 },
      ],
    };

    setLectures((prev) => [newLec, ...prev]);
  };

  return (
    <LecturePulseContext.Provider
      value={{
        lectures,
        teachers,
        reviews,
        watchlist,
        compareList,
        student,
        toggleWatchlist,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        addLectureReview,
        addTeacherComment,
        upvoteLectureReview,
        upvoteTeacherComment,
        addNewLecture,
      }}
    >
      {children}
    </LecturePulseContext.Provider>
  );
};

export const useLecturePulse = () => {
  const context = useContext(LecturePulseContext);
  if (!context) {
    throw new Error('useLecturePulse must be used within a LecturePulseProvider');
  }
  return context;
};
