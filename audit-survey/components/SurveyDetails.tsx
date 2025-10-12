import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Clock, Eye, BarChart3, FileText, TrendingUp } from 'lucide-react';
import { RootState } from '@/store';
import { fetchSurveyDetailsRequest, fetchQuestionsRequest, fetchAssignmentsRequest, closeSurveyRequest } from '../store/surveySlice';
import { SurveyAssignment } from '../types/survey';

interface SurveyDetailsProps {
  surveyId: string;
  onViewResults: () => void;
  onBack: () => void;
}

const SurveyDetails: React.FC<SurveyDetailsProps> = ({
  surveyId,
  onViewResults,
  onBack
}) => {
  const dispatch = useDispatch();
  const { 
    surveyDetails, 
    surveyDetailsLoading, 
    surveyDetailsError,
    questions,
    questionsLoading,
    questionsError,
    assignments,
    assignmentsLoading,
    assignmentsError,
    closeSurveyLoading
  } = useSelector((state: RootState) => state.survey);

  useEffect(() => {
    dispatch(fetchSurveyDetailsRequest(surveyId));
    dispatch(fetchQuestionsRequest(surveyId));
    dispatch(fetchAssignmentsRequest(surveyId));
  }, [dispatch, surveyId]);

  const handleCloseSurvey = () => {
    if (surveyDetails && surveyDetails.status === 'ACTIVE') {
      dispatch(closeSurveyRequest(surveyId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionPercentage = () => {
    if (!assignments.length) return 0;
    const completed = assignments.filter(a => a.status === 'COMPLETED').length;
    return Math.round((completed / assignments.length) * 100);
  };

  if (surveyDetailsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (surveyDetailsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{surveyDetailsError}</AlertDescription>
      </Alert>
    );
  }

  if (!surveyDetails) {
    return (
      <Alert>
        <AlertDescription>Survey not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{surveyDetails.title}</h1>
          <p className="text-muted-foreground mt-2">
            {surveyDetails.project} • Created {formatDate(surveyDetails.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(surveyDetails.status)}>
            {surveyDetails.status}
          </Badge>
          {surveyDetails.status === 'ACTIVE' && (
            <Button variant="outline" onClick={handleCloseSurvey} disabled={closeSurveyLoading}>
              {closeSurveyLoading ? 'Closing...' : 'Close Survey'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        {/* Results Tab - Main Focus */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Survey Results</CardTitle>
              <CardDescription>
                Response summary and analytics for {surveyDetails.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getCompletionPercentage()}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{surveyDetails.completionCount}</div>
                  <div className="text-sm text-gray-600">Responses</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{assignments.length}</div>
                  <div className="text-sm text-gray-600">Total Assignments</div>
                </div>
              </div>
              
              {/* Question-wise Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Analysis</h3>
                {questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        {question.text}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Sample Response Data</p>
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center justify-between">
                              <span className="text-sm">{option}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.random() * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">
                                  {Math.round(Math.random() * 50)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab - Compact */}
        <TabsContent value="details" className="space-y-4">
          {/* Compact Survey Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Deadline</div>
                <div className="font-semibold">{formatDate(surveyDetails.deadline)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Response Type</div>
                <div className="font-semibold">{surveyDetails.isAnonymous ? "Anonymous" : "Named"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Created By</div>
                <div className="font-semibold">{surveyDetails.createdBy}</div>
              </CardContent>
            </Card>
          </div>

          {/* Questions List - Compact */}
          <Card>
            <CardHeader>
              <CardTitle>Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge variant="outline" className="mt-0.5">{index + 1}</Badge>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{question.text}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{question.type}</Badge>
                        {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Assignments ({assignments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {assignmentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{assignment.userId}</div>
                        <div className="text-sm text-gray-600">
                          {assignment.userRole} • Assigned {formatDate(assignment.assignedAt)}
                        </div>
                      </div>
                      <Badge className={getAssignmentStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyDetails;
