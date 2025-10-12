import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSurveyStore } from '../store/surveyStore';
import SurveyHeader from './SurveyHeader';
import TemplateInfo from './TemplateInfo';
import AssignmentsTable from './AssignmentsTable';
import ResultsSummary from './ResultsSummary';
import ResponseModal from './ResponseModal';

const SurveyDetailPage: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  
  // For now, use a default surveyId if none is provided in URL
  const currentSurveyId = surveyId || '1';
  const navigate = useNavigate();
  
  const {
    surveyDetail,
    surveyKPI,
    surveyTemplate,
    assignments,
    surveySummary,
    isLoading,
    error,
    responseModalOpen,
    selectedAssignment,
    fetchSurveyDetail,
    fetchSurveyKPI,
    fetchSurveyTemplate,
    fetchAssignments,
    fetchSurveySummary,
    closeResponseModal,
    clearError
  } = useSurveyStore();

  useEffect(() => {
    if (currentSurveyId) {
      // Fetch all survey data in parallel
      Promise.all([
        fetchSurveyDetail(currentSurveyId),
        fetchSurveyKPI(currentSurveyId),
        fetchSurveyTemplate(currentSurveyId),
        fetchAssignments(currentSurveyId),
        fetchSurveySummary(currentSurveyId)
      ]).catch(console.error);
    }
  }, [currentSurveyId, fetchSurveyDetail, fetchSurveyKPI, fetchSurveyTemplate, fetchAssignments, fetchSurveySummary]);

  const handleBack = () => {
    // Go back to the previous page or dashboard
    window.history.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading && !surveyDetail) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!surveyDetail) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Survey not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{surveyDetail.name}</h1>
            <Badge className={`${getStatusColor(surveyDetail.status)} border flex items-center gap-1`}>
              {getStatusIcon(surveyDetail.status)}
              {surveyDetail.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {surveyDetail.code} • Created by {surveyDetail.owner}
          </p>
        </div>
      </div>

      {/* Survey Header with KPIs */}
      <SurveyHeader 
        surveyDetail={surveyDetail}
        surveyKPI={surveyKPI}
        isLoading={isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Template Info */}
          <TemplateInfo 
            template={surveyTemplate}
            isLoading={isLoading}
          />

          {/* Assignments Table */}
          <AssignmentsTable 
            assignments={assignments}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Results Summary */}
          <ResultsSummary 
            summary={surveySummary}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Response Modal */}
      {responseModalOpen && selectedAssignment && (
        <ResponseModal 
          assignment={selectedAssignment}
          surveyId={currentSurveyId}
          onClose={closeResponseModal}
        />
      )}
    </div>
  );
};

export default SurveyDetailPage;
