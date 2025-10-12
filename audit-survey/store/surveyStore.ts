import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface SurveyDetail {
  id: string;
  name: string;
  code: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
  owner: string;
  templateName: string;
  templateVersion: string;
  templateCreatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyKPI {
  totalAssigned: number;
  completed: number;
  avgCompletionTime: number; // in hours
  lastSubmissionDate?: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TEXT' | 'SCALE' | 'CHECKBOX';
  options?: string[];
  required: boolean;
  order: number;
}

export interface SurveyTemplate {
  id: string;
  name: string;
  version: string;
  createdBy: string;
  questions: SurveyQuestion[];
}

export interface SurveyAssignment {
  id: string;
  assignee: string;
  assigneeName?: string;
  status: 'PENDING' | 'DRAFT' | 'SUBMITTED' | 'DISCARDED';
  emailStatus: 'SENT' | 'FAILED';
  assignedAt: string;
  submittedAt?: string;
  completedAt?: string;
}

export interface SurveyResponse {
  id: string;
  assignee: string;
  assigneeName?: string;
  status: 'DRAFT' | 'SUBMITTED';
  submittedAt?: string;
  answers: ResponseAnswer[];
}

export interface ResponseAnswer {
  questionId: string;
  questionText: string;
  selectedOptions?: string[];
  answerText?: string;
  scaleValue?: number;
}

export interface SurveySummary {
  completedCount: number;
  totalCount: number;
  avgCompletionTime: number;
  lastSubmissionDate?: string;
  questionBreakdown: QuestionBreakdown[];
}

export interface QuestionBreakdown {
  questionId: string;
  questionText: string;
  questionType: string;
  responses: {
    [key: string]: number; // option -> count
  };
  totalResponses: number;
}

// Store State
interface SurveyStore {
  // Survey data
  surveyDetail: SurveyDetail | null;
  surveyKPI: SurveyKPI | null;
  surveyTemplate: SurveyTemplate | null;
  assignments: SurveyAssignment[];
  surveySummary: SurveySummary | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  selectedAssignment: SurveyAssignment | null;
  responseModalOpen: boolean;
  templateExpanded: boolean;
  
  // Actions
  fetchSurveyDetail: (surveyId: string) => Promise<void>;
  fetchSurveyKPI: (surveyId: string) => Promise<void>;
  fetchSurveyTemplate: (surveyId: string) => Promise<void>;
  fetchAssignments: (surveyId: string) => Promise<void>;
  fetchSurveySummary: (surveyId: string) => Promise<void>;
  fetchSurveyResponse: (surveyId: string, assignee: string) => Promise<SurveyResponse | null>;
  
  // UI actions
  setSelectedAssignment: (assignment: SurveyAssignment | null) => void;
  openResponseModal: (assignment: SurveyAssignment) => void;
  closeResponseModal: () => void;
  toggleTemplateExpanded: () => void;
  clearError: () => void;
}

// Mock data
const mockSurveyDetail: SurveyDetail = {
  id: '1',
  name: 'Q4 Security Audit',
  code: 'SEC-Q4-2024',
  deadline: '2024-12-31T23:59:59Z',
  status: 'OPEN',
  owner: 'admin@company.com',
  templateName: 'Security Assessment Template',
  templateVersion: 'v2.1',
  templateCreatedBy: 'security-team@company.com',
  createdAt: '2024-11-01T10:00:00Z',
  updatedAt: '2024-11-15T14:30:00Z'
};

const mockKPI: SurveyKPI = {
  totalAssigned: 25,
  completed: 18,
  avgCompletionTime: 2.5,
  lastSubmissionDate: '2024-12-10T16:45:00Z'
};

const mockTemplate: SurveyTemplate = {
  id: 't1',
  name: 'Security Assessment Template',
  version: 'v2.1',
  createdBy: 'security-team@company.com',
  questions: [
    {
      id: 'q1',
      text: 'How would you rate the current security awareness in your team?',
      type: 'SCALE',
      required: true,
      order: 1
    },
    {
      id: 'q2',
      text: 'Which security practices does your team follow regularly?',
      type: 'CHECKBOX',
      options: ['Password policies', 'Two-factor authentication', 'Regular security updates', 'Access reviews', 'Security training'],
      required: true,
      order: 2
    },
    {
      id: 'q3',
      text: 'What is the biggest security concern in your current workflow?',
      type: 'TEXT',
      required: false,
      order: 3
    },
    {
      id: 'q4',
      text: 'How often do you review access permissions?',
      type: 'MULTIPLE_CHOICE',
      options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Never'],
      required: true,
      order: 4
    }
  ]
};

const mockAssignments: SurveyAssignment[] = [
  {
    id: 'a1',
    assignee: 'john.doe@company.com',
    assigneeName: 'John Doe',
    status: 'SUBMITTED',
    emailStatus: 'SENT',
    assignedAt: '2024-11-01T10:00:00Z',
    submittedAt: '2024-11-15T14:30:00Z',
    completedAt: '2024-11-15T14:30:00Z'
  },
  {
    id: 'a2',
    assignee: 'jane.smith@company.com',
    assigneeName: 'Jane Smith',
    status: 'SUBMITTED',
    emailStatus: 'SENT',
    assignedAt: '2024-11-01T10:00:00Z',
    submittedAt: '2024-11-20T09:15:00Z',
    completedAt: '2024-11-20T09:15:00Z'
  },
  {
    id: 'a3',
    assignee: 'mike.wilson@company.com',
    assigneeName: 'Mike Wilson',
    status: 'DRAFT',
    emailStatus: 'SENT',
    assignedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'a4',
    assignee: 'sarah.johnson@company.com',
    assigneeName: 'Sarah Johnson',
    status: 'PENDING',
    emailStatus: 'SENT',
    assignedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'a5',
    assignee: 'tom.brown@company.com',
    assigneeName: 'Tom Brown',
    status: 'DISCARDED',
    emailStatus: 'FAILED',
    assignedAt: '2024-11-01T10:00:00Z'
  }
];

const mockSummary: SurveySummary = {
  completedCount: 18,
  totalCount: 25,
  avgCompletionTime: 2.5,
  lastSubmissionDate: '2024-12-10T16:45:00Z',
  questionBreakdown: [
    {
      questionId: 'q1',
      questionText: 'How would you rate the current security awareness in your team?',
      questionType: 'SCALE',
      responses: {
        '1': 2,
        '2': 3,
        '3': 8,
        '4': 4,
        '5': 1
      },
      totalResponses: 18
    },
    {
      questionId: 'q2',
      questionText: 'Which security practices does your team follow regularly?',
      questionType: 'CHECKBOX',
      responses: {
        'Password policies': 15,
        'Two-factor authentication': 12,
        'Regular security updates': 18,
        'Access reviews': 8,
        'Security training': 10
      },
      totalResponses: 18
    },
    {
      questionId: 'q4',
      questionText: 'How often do you review access permissions?',
      questionType: 'MULTIPLE_CHOICE',
      responses: {
        'Daily': 2,
        'Weekly': 5,
        'Monthly': 8,
        'Quarterly': 3,
        'Never': 0
      },
      totalResponses: 18
    }
  ]
};

// Store implementation
export const useSurveyStore = create<SurveyStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      surveyDetail: null,
      surveyKPI: null,
      surveyTemplate: null,
      assignments: [],
      surveySummary: null,
      isLoading: false,
      error: null,
      selectedAssignment: null,
      responseModalOpen: false,
      templateExpanded: false,

      // Actions
      fetchSurveyDetail: async (surveyId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ surveyDetail: mockSurveyDetail, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch survey details', isLoading: false });
        }
      },

      fetchSurveyKPI: async (surveyId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ surveyKPI: mockKPI });
        } catch (error) {
          set({ error: 'Failed to fetch survey KPI' });
        }
      },

      fetchSurveyTemplate: async (surveyId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ surveyTemplate: mockTemplate });
        } catch (error) {
          set({ error: 'Failed to fetch survey template' });
        }
      },

      fetchAssignments: async (surveyId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          set({ assignments: mockAssignments });
        } catch (error) {
          set({ error: 'Failed to fetch assignments' });
        }
      },

      fetchSurveySummary: async (surveyId: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 700));
          set({ surveySummary: mockSummary });
        } catch (error) {
          set({ error: 'Failed to fetch survey summary' });
        }
      },

      fetchSurveyResponse: async (surveyId: string, assignee: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock response data
          const mockResponse: SurveyResponse = {
            id: 'r1',
            assignee: assignee,
            assigneeName: mockAssignments.find(a => a.assignee === assignee)?.assigneeName,
            status: 'SUBMITTED',
            submittedAt: '2024-11-15T14:30:00Z',
            answers: [
              {
                questionId: 'q1',
                questionText: 'How would you rate the current security awareness in your team?',
                scaleValue: 4
              },
              {
                questionId: 'q2',
                questionText: 'Which security practices does your team follow regularly?',
                selectedOptions: ['Password policies', 'Two-factor authentication', 'Regular security updates']
              },
              {
                questionId: 'q3',
                questionText: 'What is the biggest security concern in your current workflow?',
                answerText: 'The lack of automated security scanning in our CI/CD pipeline is concerning.'
              },
              {
                questionId: 'q4',
                questionText: 'How often do you review access permissions?',
                selectedOptions: ['Monthly']
              }
            ]
          };
          
          return mockResponse;
        } catch (error) {
          set({ error: 'Failed to fetch survey response' });
          return null;
        }
      },

      // UI actions
      setSelectedAssignment: (assignment) => set({ selectedAssignment: assignment }),
      
      openResponseModal: (assignment) => set({ 
        selectedAssignment: assignment, 
        responseModalOpen: true 
      }),
      
      closeResponseModal: () => set({ 
        selectedAssignment: null, 
        responseModalOpen: false 
      }),
      
      toggleTemplateExpanded: () => set((state) => ({ 
        templateExpanded: !state.templateExpanded 
      })),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'survey-store',
    }
  )
);

