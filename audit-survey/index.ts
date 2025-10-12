// Audit Survey Module Exports
export { default as AuditSurveyPage } from './AuditSurveyPage';
export { default as AdminDashboard } from './components/AdminDashboard';
export { default as UserDashboard } from './components/UserDashboard';
export { default as SurveysGrid } from './components/SurveysGrid';
export { default as AssignmentsGrid } from './components/AssignmentsGrid';
export { default as ResponsesGrid } from './components/ResponsesGrid';
export { default as CreateSurveyModal } from './components/CreateSurveyModal';
export { default as SurveyDetails } from './components/SurveyDetails';
export { default as SurveyResults } from './components/SurveyResults';
export { default as TakeSurvey } from './components/TakeSurvey';

// Store
export { default as surveyReducer } from './store/surveySlice';
export { surveySaga } from './store/surveySaga';

// Types
export type {
  Survey,
  SurveyAssignment,
  Question,
  SurveyResponse,
  SurveyResults,
  SurveySummary,
  CreateSurveyRequest,
  UserAssignment,
  SurveyTemplate,
  ExportRequest
} from './types/survey';

// Constants
export { SURVEY_TEMPLATES, PROJECTS, USER_ROLES } from './constants/templates';

// API (for external use if needed)
export * from './api/survey';
