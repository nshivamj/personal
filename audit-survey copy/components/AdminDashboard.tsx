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
  viewMode?: 'table';
  onToggleView?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCreateSurvey,
  onViewSurvey,
  onViewResults,
  viewMode = 'table',
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
        <SurveysTable
                      surveys={adminSurveys}
                      onViewSurvey={onViewSurvey}
                      onViewResults={onViewResults}
                    />
      </div>
    </div>
  );
};

export default AdminDashboard;
