import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Eye, BarChart3, Calendar, Users, Table } from 'lucide-react';
import { RootState } from '@/store';
import { fetchAdminSurveysRequest } from '../store/surveySlice';
import { SurveySummary } from '../types/survey';
import SurveysGrid from './SurveysGrid';
import SurveysTable from './SurveysTable';

interface AdminDashboardProps {
  onCreateSurvey: () => void;
  onViewSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  viewMode?: 'card' | 'grid' | 'table';
  onToggleView?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCreateSurvey,
  onViewSurvey,
  onViewResults,
  viewMode = 'card',
  onToggleView
}) => {
  const dispatch = useDispatch();
  const { adminSurveys, adminSurveysLoading, adminSurveysError } = useSelector(
    (state: RootState) => state.survey
  );

  useEffect(() => {
    dispatch(fetchAdminSurveysRequest());
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

  const getCompletionPercentage = (survey: SurveySummary) => {
    if (survey.totalAssignments === 0) return 0;
    return Math.round((survey.completionCount / survey.totalAssignments) * 100);
  };

  if (adminSurveysError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{adminSurveysError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Survey Management</h1>
          <p className="text-muted-foreground">
            Create and manage audit surveys for your projects
          </p>
        </div>
        <div className="flex gap-2">
          {onToggleView && (
            <div className="flex gap-1">
              <Button 
                variant={viewMode === 'card' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => onToggleView?.()}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Card
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => onToggleView?.()}
                className="flex items-center gap-2"
              >
                <Table className="h-4 w-4" />
                Table
              </Button>
            </div>
          )}
          <Button onClick={onCreateSurvey} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Survey
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminSurveys.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminSurveys.filter(s => s.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminSurveys.reduce((sum, s) => sum + s.completionCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminSurveys.length > 0 
                ? Math.round(
                    adminSurveys.reduce((sum, s) => sum + getCompletionPercentage(s), 0) / adminSurveys.length
                  )
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Surveys</h2>
        
        {viewMode === 'table' ? (
          adminSurveysLoading ? (
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
          ) : adminSurveys.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first audit survey to get started
                </p>
                <Button onClick={onCreateSurvey}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Survey
                </Button>
              </CardContent>
            </Card>
          ) : (
            <SurveysTable 
              surveys={adminSurveys}
              onViewSurvey={onViewSurvey}
              onViewResults={onViewResults}
            />
          )
        ) : viewMode === 'grid' ? (
          <SurveysGrid 
            onViewSurvey={onViewSurvey}
            onViewResults={onViewResults}
          />
        ) : (
          <>
            {adminSurveysLoading ? (
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
            ) : adminSurveys.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first audit survey to get started
                  </p>
                  <Button onClick={onCreateSurvey}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Survey
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {adminSurveys.map((survey) => (
                  <Card key={survey.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{survey.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{survey.project}</span>
                            <span>•</span>
                            <span>Due {formatDate(survey.deadline)}</span>
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span>{getCompletionPercentage(survey)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${getCompletionPercentage(survey)}%` }}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {survey.completionCount} of {survey.totalAssignments} responses
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewSurvey(survey.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {survey.status === 'ACTIVE' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewResults(survey.id)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
