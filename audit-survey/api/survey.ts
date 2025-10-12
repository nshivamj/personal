import { 
  Survey, 
  SurveySummary, 
  Question, 
  SurveyAssignment, 
  SurveyResponse, 
  SurveyResults,
  CreateSurveyRequest,
  Answer 
} from '../types/survey';
import { SURVEY_TEMPLATES } from '../constants/templates';

// Mock data
const mockSurveys: SurveySummary[] = [
  {
    id: '1',
    title: 'Q4 Security Audit',
    project: 'Portfolio Frontend',
    deadline: '2024-12-31',
    status: 'ACTIVE',
    completionCount: 5,
    totalAssignments: 8,
    createdBy: 'admin',
    createdAt: '2024-11-01'
  },
  {
    id: '2',
    title: 'Code Quality Assessment',
    project: 'System Designer',
    deadline: '2024-12-15',
    status: 'DRAFT',
    completionCount: 0,
    totalAssignments: 6,
    createdBy: 'admin',
    createdAt: '2024-11-15'
  },
  {
    id: '3',
    title: 'Process Evaluation',
    project: 'YouTube Integration',
    deadline: '2024-11-30',
    status: 'CLOSED',
    completionCount: 4,
    totalAssignments: 4,
    createdBy: 'admin',
    createdAt: '2024-10-15'
  }
];

const mockUserSurveys: SurveySummary[] = [
  {
    id: '1',
    title: 'Q4 Security Audit',
    project: 'Portfolio Frontend',
    deadline: '2024-12-31',
    status: 'ACTIVE',
    completionCount: 5,
    totalAssignments: 8,
    createdBy: 'admin',
    createdAt: '2024-11-01'
  },
  {
    id: '2',
    title: 'Code Quality Assessment',
    project: 'System Designer',
    deadline: '2024-12-15',
    status: 'ACTIVE',
    completionCount: 2,
    totalAssignments: 6,
    createdBy: 'admin',
    createdAt: '2024-11-15'
  },
  {
    id: '3',
    title: 'Process Evaluation',
    project: 'YouTube Integration',
    deadline: '2024-11-30',
    status: 'CLOSED',
    completionCount: 4,
    totalAssignments: 4,
    createdBy: 'admin',
    createdAt: '2024-10-15'
  }
];

const mockSurveyDetails: Survey = {
  id: '1',
  title: 'Q4 Security Audit',
  project: 'Portfolio Frontend',
  deadline: '2024-12-31',
  status: 'ACTIVE',
  isAnonymous: false,
  createdAt: '2024-11-01',
  updatedAt: '2024-11-01',
  createdBy: 'admin',
  completionCount: 5,
  totalAssignments: 8
};

const mockQuestions: Question[] = [
  {
    id: 'q1',
    surveyId: '1',
    text: 'How often do you review security vulnerabilities in dependencies?',
    type: 'RADIO',
    options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Never'],
    required: true,
    targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
    order: 1
  },
  {
    id: 'q2',
    surveyId: '1',
    text: 'Which security practices do you follow? (Select all that apply)',
    type: 'CHECKBOX',
    options: [
      'Code reviews for security',
      'Automated security scanning',
      'Dependency vulnerability checks',
      'Security training completion',
      'Incident response procedures'
    ],
    required: true,
    targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
    order: 2
  },
  {
    id: 'q3',
    surveyId: '1',
    text: 'Rate your confidence in identifying security vulnerabilities (1-10)',
    type: 'SCALE',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    required: true,
    targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
    order: 3
  },
  {
    id: 'q4',
    surveyId: '1',
    text: 'Describe any security concerns you have with current practices',
    type: 'TEXT',
    required: false,
    targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
    order: 4
  }
];

const mockAssignments: SurveyAssignment[] = [
  {
    id: 'a1',
    surveyId: '1',
    userId: 'user1',
    userRole: 'DEVELOPER',
    status: 'COMPLETED',
    assignedAt: '2024-11-01',
    completedAt: '2024-11-05'
  },
  {
    id: 'a2',
    surveyId: '1',
    userId: 'user2',
    userRole: 'LEAD_DEVELOPER',
    status: 'PENDING',
    assignedAt: '2024-11-01'
  },
  {
    id: 'a3',
    surveyId: '1',
    userId: 'user3',
    userRole: 'SECURITY_ENGINEER',
    status: 'COMPLETED',
    assignedAt: '2024-11-01',
    completedAt: '2024-11-03'
  }
];

const mockResponses: SurveyResponse[] = [
  {
    id: 'r1',
    surveyId: '1',
    userId: 'user1',
    userRole: 'DEVELOPER',
    answers: [
      { questionId: 'q1', value: 'Weekly' },
      { questionId: 'q2', value: ['Code reviews for security', 'Automated security scanning'] },
      { questionId: 'q3', value: '7' },
      { questionId: 'q4', textValue: 'Need better training on dependency vulnerabilities' }
    ],
    submittedAt: '2024-11-05T10:30:00Z',
    isAnonymous: false
  }
];

const mockResults: SurveyResults = {
  surveyId: '1',
  totalResponses: 5,
  completionRate: 62.5,
  aggregatedData: {
    q1: {
      'Daily': 1,
      'Weekly': 3,
      'Monthly': 1,
      'Quarterly': 0,
      'Never': 0
    },
    q2: {
      'Code reviews for security': 4,
      'Automated security scanning': 3,
      'Dependency vulnerability checks': 2,
      'Security training completion': 1,
      'Incident response procedures': 1
    },
    q3: {
      '5': 1,
      '6': 1,
      '7': 2,
      '8': 1,
      '9': 0,
      '10': 0
    }
  }
};

// API functions
export const fetchAdminSurveys = async (): Promise<SurveySummary[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockSurveys;
};

export const fetchUserSurveys = async (): Promise<SurveySummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockUserSurveys;
};

export const fetchSurveyDetails = async (surveyId: string): Promise<Survey> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find survey in mock data
  const survey = mockSurveys.find(s => s.id === surveyId);
  if (!survey) {
    throw new Error('Survey not found');
  }
  
  // Return survey details with full Survey type
  return {
    id: survey.id,
    title: survey.title,
    project: survey.project,
    deadline: survey.deadline,
    status: survey.status,
    isAnonymous: surveyId === '1' ? true : false, // Mock anonymous setting
    createdAt: survey.createdAt,
    updatedAt: survey.createdAt,
    createdBy: survey.createdBy,
    completionCount: survey.completionCount,
    totalAssignments: survey.totalAssignments
  };
};

export const fetchQuestions = async (surveyId: string): Promise<Question[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // For now, return questions for survey '1', empty for others
  if (surveyId === '1') {
    return mockQuestions;
  }
  // Return empty array for other surveys (they don't have questions set up yet)
  return [];
};

export const fetchAssignments = async (surveyId: string): Promise<SurveyAssignment[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // For now, return assignments for survey '1', empty for others
  if (surveyId === '1') {
    return mockAssignments;
  }
  // Return empty array for other surveys (they don't have assignments set up yet)
  return [];
};

export const fetchResponses = async (surveyId: string): Promise<SurveyResponse[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (surveyId === '1') {
    return mockResponses;
  }
  return [];
};

export const fetchResults = async (surveyId: string): Promise<SurveyResults> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (surveyId === '1') {
    return mockResults;
  }
  throw new Error('Results not found');
};

export const createSurvey = async (data: CreateSurveyRequest): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Creating survey:', data);
  // In a real implementation, this would make an API call
};

export const submitResponse = async (surveyId: string, answers: Answer[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Submitting response for survey:', surveyId, answers);
  // In a real implementation, this would make an API call
};

export const closeSurvey = async (surveyId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Closing survey:', surveyId);
  // In a real implementation, this would make an API call
};

export const exportResults = async (surveyId: string, format: 'CSV' | 'JSON'): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Exporting results for survey:', surveyId, 'format:', format);
  
  // Mock CSV export
  const csvContent = 'Question,Response,Count\n"Security Review Frequency","Weekly",3\n"Security Review Frequency","Daily",1';
  return new Blob([csvContent], { type: 'text/csv' });
};

export const getTemplates = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return SURVEY_TEMPLATES;
};
