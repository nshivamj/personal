export interface Survey {
  id: string;
  title: string;
  project: string;
  deadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  completionCount: number;
  totalAssignments: number;
}

export interface SurveyAssignment {
  id: string;
  surveyId: string;
  userId: string;
  userRole: string;
  status: 'PENDING' | 'COMPLETED';
  assignedAt: string;
  completedAt?: string;
}

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: 'RADIO' | 'CHECKBOX' | 'TEXT' | 'SCALE';
  options?: string[];
  required: boolean;
  targetRoles: string[];
  order: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  userRole: string;
  answers: Answer[];
  submittedAt: string;
  isAnonymous: boolean;
}

export interface Answer {
  questionId: string;
  value: string | string[];
  textValue?: string;
}

export interface CreateSurveyRequest {
  title: string;
  project: string;
  deadline: string;
  isAnonymous: boolean;
  templateId: string;
  assignments: UserAssignment[];
}

export interface UserAssignment {
  userId: string;
  roles: string[];
}

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  questions: Omit<Question, 'id' | 'surveyId'>[];
}

export interface SurveyResults {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  aggregatedData: {
    [questionId: string]: {
      [option: string]: number;
    };
  };
}

export interface ExportRequest {
  surveyId: string;
  format: 'CSV' | 'JSON';
}

export interface SurveySummary {
  id: string;
  title: string;
  project: string;
  deadline: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  completionCount: number;
  totalAssignments: number;
  createdBy: string;
  createdAt: string;
}
