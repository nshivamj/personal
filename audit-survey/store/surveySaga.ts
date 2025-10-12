import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
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
} from './surveySlice';
import * as surveyApi from '../api/survey';

// Admin surveys
function* fetchAdminSurveysSaga() {
  try {
    const surveys = yield call(surveyApi.fetchAdminSurveys);
    yield put(fetchAdminSurveysSuccess(surveys));
  } catch (error: any) {
    yield put(fetchAdminSurveysFailure(error.message || 'Failed to fetch admin surveys'));
  }
}

// User surveys
function* fetchUserSurveysSaga() {
  try {
    const surveys = yield call(surveyApi.fetchUserSurveys);
    yield put(fetchUserSurveysSuccess(surveys));
  } catch (error: any) {
    yield put(fetchUserSurveysFailure(error.message || 'Failed to fetch user surveys'));
  }
}

// Survey details
function* fetchSurveyDetailsSaga(action: any) {
  try {
    const survey = yield call(surveyApi.fetchSurveyDetails, action.payload);
    yield put(fetchSurveyDetailsSuccess(survey));
  } catch (error: any) {
    yield put(fetchSurveyDetailsFailure(error.message || 'Failed to fetch survey details'));
  }
}

// Questions
function* fetchQuestionsSaga(action: any) {
  try {
    const questions = yield call(surveyApi.fetchQuestions, action.payload);
    yield put(fetchQuestionsSuccess(questions));
  } catch (error: any) {
    yield put(fetchQuestionsFailure(error.message || 'Failed to fetch questions'));
  }
}

// Assignments
function* fetchAssignmentsSaga(action: any) {
  try {
    const assignments = yield call(surveyApi.fetchAssignments, action.payload);
    yield put(fetchAssignmentsSuccess(assignments));
  } catch (error: any) {
    yield put(fetchAssignmentsFailure(error.message || 'Failed to fetch assignments'));
  }
}

// Responses
function* fetchResponsesSaga(action: any) {
  try {
    const responses = yield call(surveyApi.fetchResponses, action.payload);
    yield put(fetchResponsesSuccess(responses));
  } catch (error: any) {
    yield put(fetchResponsesFailure(error.message || 'Failed to fetch responses'));
  }
}

// Results
function* fetchResultsSaga(action: any) {
  try {
    const results = yield call(surveyApi.fetchResults, action.payload);
    yield put(fetchResultsSuccess(results));
  } catch (error: any) {
    yield put(fetchResultsFailure(error.message || 'Failed to fetch results'));
  }
}

// Create survey
function* createSurveySaga(action: any) {
  try {
    yield call(surveyApi.createSurvey, action.payload);
    yield put(createSurveySuccess());
    // Refresh admin surveys after creation
    yield put(fetchAdminSurveysRequest());
  } catch (error: any) {
    yield put(createSurveyFailure(error.message || 'Failed to create survey'));
  }
}

// Submit response
function* submitResponseSaga(action: any) {
  try {
    yield call(surveyApi.submitResponse, action.payload.surveyId, action.payload.answers);
    yield put(submitResponseSuccess());
    // Refresh user surveys after submission
    yield put(fetchUserSurveysRequest());
  } catch (error: any) {
    yield put(submitResponseFailure(error.message || 'Failed to submit response'));
  }
}

// Close survey
function* closeSurveySaga(action: any) {
  try {
    yield call(surveyApi.closeSurvey, action.payload);
    yield put(closeSurveySuccess());
    // Refresh admin surveys after closing
    yield put(fetchAdminSurveysRequest());
  } catch (error: any) {
    yield put(closeSurveyFailure(error.message || 'Failed to close survey'));
  }
}

export function* surveySaga() {
  yield takeLatest(fetchAdminSurveysRequest.type, fetchAdminSurveysSaga);
  yield takeLatest(fetchUserSurveysRequest.type, fetchUserSurveysSaga);
  yield takeLatest(fetchSurveyDetailsRequest.type, fetchSurveyDetailsSaga);
  yield takeLatest(fetchQuestionsRequest.type, fetchQuestionsSaga);
  yield takeLatest(fetchAssignmentsRequest.type, fetchAssignmentsSaga);
  yield takeLatest(fetchResponsesRequest.type, fetchResponsesSaga);
  yield takeLatest(fetchResultsRequest.type, fetchResultsSaga);
  yield takeLatest(createSurveyRequest.type, createSurveySaga);
  yield takeLatest(submitResponseRequest.type, submitResponseSaga);
  yield takeLatest(closeSurveyRequest.type, closeSurveySaga);
}
