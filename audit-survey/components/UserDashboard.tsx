import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { RootState } from '@/store';
import { fetchUserSurveysRequest } from '../store/surveySlice';
import { SurveySummary } from '../types/survey';

interface UserDashboardProps {
  onTakeSurvey: (surveyId: string) => void;
  onViewSubmittedSurvey: (surveyId: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  onTakeSurvey,
  onViewSubmittedSurvey
}) => {
  const dispatch = useDispatch();
  const { userSurveys, userSurveysLoading, userSurveysError } = useSelector(
    (state: RootState) => state.survey
  );

  useEffect(() => {
    dispatch(fetchUserSurveysRequest());
  }, [dispatch]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (deadline: string) => {
    return getDaysUntilDeadline(deadline) < 0;
  };

  const isUrgent = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    return days >= 0 && days <= 3;
  };

  if (userSurveysError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{userSurveysError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Surveys</h1>
        <p className="text-muted-foreground">
          Complete your assigned audit surveys
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSurveys.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userSurveys.filter(s => s.status === 'CLOSED').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userSurveys.filter(s => s.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userSurveys.filter(s => s.status === 'ACTIVE' && (isUrgent(s.deadline) || isOverdue(s.deadline))).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        {userSurveysLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-8 w-[120px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userSurveys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No surveys assigned</h3>
              <p className="text-muted-foreground text-center">
                You don't have any assigned surveys at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userSurveys.map((survey) => {
              const daysUntilDeadline = getDaysUntilDeadline(survey.deadline);
              const isCompleted = survey.status === 'CLOSED';
              const isSurveyClosed = survey.status === 'CLOSED';
              const canTakeSurvey = survey.status === 'ACTIVE';

              return (
                <Card key={survey.id} className={`hover:shadow-md transition-shadow ${
                  isOverdue(survey.deadline) && !isCompleted ? 'border-red-200 bg-red-50' : 
                  isUrgent(survey.deadline) && !isCompleted ? 'border-yellow-200 bg-yellow-50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{survey.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{survey.project}</span>
                          <span>•</span>
                          <span>Due {formatDate(survey.deadline)}</span>
                          {daysUntilDeadline >= 0 && (
                            <>
                              <span>•</span>
                              <span className={isUrgent(survey.deadline) ? 'text-yellow-600' : ''}>
                                {daysUntilDeadline === 0 ? 'Due today' : `${daysUntilDeadline} days left`}
                              </span>
                            </>
                          )}
                          {isOverdue(survey.deadline) && (
                            <>
                              <span>•</span>
                              <span className="text-red-600 font-medium">
                                {Math.abs(daysUntilDeadline)} days overdue
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                        {isCompleted && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress indicator for overall survey */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Survey Progress</span>
                          <span>{survey.completionCount} of {survey.totalAssignments} completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${survey.totalAssignments > 0 ? Math.round((survey.completionCount / survey.totalAssignments) * 100) : 0}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {canTakeSurvey && (
                          <Button onClick={() => onTakeSurvey(survey.id)}>
                            {isOverdue(survey.deadline) ? 'Complete Now (Overdue)' : 'Take Survey'}
                          </Button>
                        )}
                        
                        {isCompleted && (
                          <Button
                            variant="outline"
                            onClick={() => onViewSubmittedSurvey(survey.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Submitted Response
                          </Button>
                        )}

                        {isSurveyClosed && (
                          <Button variant="outline" disabled>
                            Survey Closed
                          </Button>
                        )}

                        {isUrgent(survey.deadline) && !isCompleted && (
                          <Badge variant="destructive" className="ml-auto">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
