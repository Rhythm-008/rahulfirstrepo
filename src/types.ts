export interface RatingBreakdown {
  overall: number; // 1.0 to 5.0
  clarity: number; // 1.0 to 5.0
  pacing: number; // 1.0 to 5.0 (3 = ideal pace, 1 = sluggish, 5 = rushed)
  difficulty: number; // 1.0 to 5.0 (1 = easy, 5 = intense)
  engagement: number; // 1.0 to 5.0
  materialsQuality: number; // 1.0 to 5.0 (slides, notes, code)
  examRelevance: number; // 1.0 to 5.0
  totalRatingsCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface LectureTrendPoint {
  lectureNum: number;
  label: string;
  rating: number;
  difficulty: number;
}

export interface Lecture {
  id: string;
  courseCode: string;
  courseName: string;
  lectureNumber: number;
  title: string;
  professorId: string;
  professorName: string;
  department: string;
  semester: string;
  date: string;
  durationMinutes: number;
  hallRoom: string;
  slidesAvailable: boolean;
  recordingAvailable: boolean;
  ratings: RatingBreakdown;
  tags: string[];
  summaryKeyTakeaways: string[];
  trendHistory: LectureTrendPoint[];
  alertFlags: {
    isDifficultyAlert?: boolean;
    isMustAttend?: boolean;
    isExamPrepCritical?: boolean;
    isPacingWarning?: boolean;
  };
}

export interface LectureReview {
  id: string;
  lectureId: string;
  studentHandle: string;
  isAnonymous: boolean;
  attendanceMode: 'In-Person Hall' | '1.5x Recording' | 'Live Stream';
  date: string;
  overallRating: number;
  clarityRating: number;
  pacingRating: number;
  difficultyRating: number;
  engagementRating: number;
  materialsRating: number;
  examRelevanceRating: number;
  reviewText: string;
  studentTip: string; // Actionable advice for peers
  upvotes: number;
  userUpvoted?: boolean;
}

export interface TeacherStudentComment {
  id: string;
  teacherId: string;
  studentHandle: string;
  isAnonymous: boolean;
  date: string;
  courseTaken: string;
  semesterTaken: string;
  gradeReceived?: string;
  category: 'How to Approach' | 'Teaching Style' | 'Office Hours' | 'Exams & Grading' | 'Mentorship & Research' | 'General Advice';
  comment: string;
  insiderTip: string; // Specific instruction to get well-known or succeed with this professor
  ratings: {
    approachability: number; // 1 to 5
    clarity: number; // 1 to 5
    fairness: number; // 1 to 5
  };
  upvotes: number;
  userUpvoted?: boolean;
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  officeRoom: string;
  officeHours: string;
  bio: string;
  coursesTaught: {
    code: string;
    name: string;
    currentSemester: boolean;
  }[];
  metrics: {
    overallRating: number;
    clarity: number;
    helpfulness: number;
    approachability: number;
    gradingFairness: number;
    wouldTakeAgainPercentage: number;
    totalStudentComments: number;
  };
  teachingStyleSummary: string;
  howToGetKnownGuide: {
    bestOfficeHoursApproach: string;
    classroomParticipationTip: string;
    researchOpportunityAdvice: string;
    recommendedEmailEtiquette: string;
    commonStudentMistakes: string;
  };
  studentComments: TeacherStudentComment[];
}

export interface StudentProfile {
  name: string;
  handle: string;
  major: string;
  year: string;
  avatarSeed: string;
}
