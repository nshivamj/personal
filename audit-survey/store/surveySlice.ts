import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  Survey, 
  SurveyAssignment, 
  Question, 
  SurveyResponse, 
  SurveyResults,
  SurveySummary,
  CreateSurveyRequest 
} from '../types/survey';

interface SurveyState {
  // Admin surveys
  adminSurveys: SurveySummary[];
  adminSurveysLoading: boolean;
  adminSurveysError: string | null;

  // User assigned surveys
  userSurveys: SurveySummary[];
  userSurveysLoading: boolean;
  userSurveysError: string | null;

  // Survey details
  surveyDetails: Survey | null;
  surveyDetailsLoading: boolean;
  surveyDetailsError: string | null;

  // Questions
  questions: Question[];
  questionsLoading: boolean;
  questionsError: string | null;

  // Assignments
  assignments: SurveyAssignment[];
  assignmentsLoading: boolean;
  assignmentsError: string | null;

  // Responses
  responses: SurveyResponse[];
  responsesLoading: boolean;
  responsesError: string | null;

  // Results
  results: SurveyResults | null;
  resultsLoading: boolean;
  resultsError: string | null;

  // Create survey
  createSurveyLoading: boolean;
  createSurveyError: string | null;

  // Submit response
  submitResponseLoading: boolean;
  submitResponseError: string | null;

  // Close survey
  closeSurveyLoading: boolean;
  closeSurveyError: string | null;
}

const initialState: SurveyState = {
  adminSurveys: [],
  adminSurveysLoading: false,
  adminSurveysError: null,

  userSurveys: [],
  userSurveysLoading: false,
  userSurveysError: null,

  surveyDetails: null,
  surveyDetailsLoading: false,
  surveyDetailsError: null,

  questions: [],
  questionsLoading: false,
  questionsError: null,

  assignments: [],
  assignmentsLoading: false,
  assignmentsError: null,

  responses: [],
  responsesLoading: false,
  responsesError: null,

  results: null,
  resultsLoading: false,
  resultsError: null,

  createSurveyLoading: false,
  createSurveyError: null,

  submitResponseLoading: false,
  submitResponseError: null,

  closeSurveyLoading: false,
  closeSurveyError: null,
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Admin surveys
    fetchAdminSurveysRequest: (state) => {
      state.adminSurveysLoading = true;
      state.adminSurveysError = null;
    },
    fetchAdminSurveysSuccess: (state, action: PayloadAction<SurveySummary[]>) => {
      state.adminSurveysLoading = false;
      state.adminSurveys = action.payload;
    },
    fetchAdminSurveysFailure: (state, action: PayloadAction<string>) => {
      state.adminSurveysLoading = false;
      state.adminSurveysError = action.payload;
    },

    // User surveys
    fetchUserSurveysRequest: (state) => {
      state.userSurveysLoading = true;
      state.userSurveysError = null;
    },
    fetchUserSurveysSuccess: (state, action: PayloadAction<SurveySummary[]>) => {
      state.userSurveysLoading = false;
      state.userSurveys = action.payload;
    },
    fetchUserSurveysFailure: (state, action: PayloadAction<string>) => {
      state.userSurveysLoading = false;
      state.userSurveysError = action.payload;
    },

    // Survey details
    fetchSurveyDetailsRequest: (state, action: PayloadAction<string>) => {
      state.surveyDetailsLoading = true;
      state.surveyDetailsError = null;
    },
    fetchSurveyDetailsSuccess: (state, action: PayloadAction<Survey>) => {
      state.surveyDetailsLoading = false;
      state.surveyDetails = action.payload;
    },
    fetchSurveyDetailsFailure: (state, action: PayloadAction<string>) => {
      state.surveyDetailsLoading = false;
      state.surveyDetailsError = action.payload;
    },

    // Questions
    fetchQuestionsRequest: (state, action: PayloadAction<string>) => {
      state.questionsLoading = true;
      state.questionsError = null;
    },
    fetchQuestionsSuccess: (state, action: PayloadAction<Question[]>) => {
      state.questionsLoading = false;
      state.questions = action.payload;
    },
    fetchQuestionsFailure: (state, action: PayloadAction<string>) => {
      state.questionsLoading = false;
      state.questionsError = action.payload;
    },

    // Assignments
    fetchAssignmentsRequest: (state, action: PayloadAction<string>) => {
      state.assignmentsLoading = true;
      state.assignmentsError = null;
    },
    fetchAssignmentsSuccess: (state, action: PayloadAction<SurveyAssignment[]>) => {
      state.assignmentsLoading = false;
      state.assignments = action.payload;
    },
    fetchAssignmentsFailure: (state, action: PayloadAction<string>) => {
      state.assignmentsLoading = false;
      state.assignmentsError = action.payload;
    },

    // Responses
    fetchResponsesRequest: (state) => {
      state.responsesLoading = true;
      state.responsesError = null;
    },
    fetchResponsesSuccess: (state, action: PayloadAction<SurveyResponse[]>) => {
      state.responsesLoading = false;
      state.responses = action.payload;
    },
    fetchResponsesFailure: (state, action: PayloadAction<string>) => {
      state.responsesLoading = false;
      state.responsesError = action.payload;
    },

    // Results
    fetchResultsRequest: (state) => {
      state.resultsLoading = true;
      state.resultsError = null;
    },
    fetchResultsSuccess: (state, action: PayloadAction<SurveyResults>) => {
      state.resultsLoading = false;
      state.results = action.payload;
    },
    fetchResultsFailure: (state, action: PayloadAction<string>) => {
      state.resultsLoading = false;
      state.resultsError = action.payload;
    },

    // Create survey
    createSurveyRequest: (state, action: PayloadAction<CreateSurveyRequest>) => {
      state.createSurveyLoading = true;
      state.createSurveyError = null;
    },
    createSurveySuccess: (state) => {
      state.createSurveyLoading = false;
    },
    createSurveyFailure: (state, action: PayloadAction<string>) => {
      state.createSurveyLoading = false;
      state.createSurveyError = action.payload;
    },

    // Submit response
    submitResponseRequest: (state, action: PayloadAction<{ surveyId: string; answers: any[] }>) => {
      state.submitResponseLoading = true;
      state.submitResponseError = null;
    },
    submitResponseSuccess: (state) => {
      state.submitResponseLoading = false;
    },
    submitResponseFailure: (state, action: PayloadAction<string>) => {
      state.submitResponseLoading = false;
      state.submitResponseError = action.payload;
    },

    // Close survey
    closeSurveyRequest: (state, action: PayloadAction<string>) => {
      state.closeSurveyLoading = true;
      state.closeSurveyError = null;
    },
    closeSurveySuccess: (state) => {
      state.closeSurveyLoading = false;
    },
    closeSurveyFailure: (state, action: PayloadAction<string>) => {
      state.closeSurveyLoading = false;
      state.closeSurveyError = action.payload;
    },

    // Clear errors
    clearErrors: (state) => {
      state.adminSurveysError = null;
      state.userSurveysError = null;
      state.surveyDetailsError = null;
      state.questionsError = null;
      state.assignmentsError = null;
      state.responsesError = null;
      state.resultsError = null;
      state.createSurveyError = null;
      state.submitResponseError = null;
      state.closeSurveyError = null;
    },
  },
});

export const {
  fetchAdminSurveysRequest,
  fetchAdminSurveysSuccess,
  fetchAdminSurveysFailure,
  fetchUserSurveysRequest,
  fetchUserSurveysSuccess,
  fetchUserSurveysFailure,
  fetchSurveyDetailsRequest,
  fetchSurveyDetailsSuccess,
  fetchSurveyDetailsFailure,
  fetchQuestionsRequest,
  fetchQuestionsSuccess,
  fetchQuestionsFailure,
  fetchAssignmentsRequest,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
  fetchResponsesRequest,
  fetchResponsesSuccess,
  fetchResponsesFailure,
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  createSurveyRequest,
  createSurveySuccess,
  createSurveyFailure,
  submitResponseRequest,
  submitResponseSuccess,
  submitResponseFailure,
  closeSurveyRequest,
  closeSurveySuccess,
  closeSurveyFailure,
  clearErrors,
} = surveySlice.actions;

export default surveySlice.reducer;
