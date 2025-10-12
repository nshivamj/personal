import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { SurveyDetail, SurveyKPI } from '../store/surveyStore';

interface SurveyHeaderProps {
  surveyDetail: SurveyDetail;
  surveyKPI: SurveyKPI | null;
  isLoading: boolean;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({
  surveyDetail,
  surveyKPI,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCompletionTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const getCompletionRate = () => {
    if (!surveyKPI) return 0;
    return Math.round((surveyKPI.completed / surveyKPI.totalAssigned) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Survey Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Overview</CardTitle>
          <CardDescription>Basic information about this survey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Deadline
              </div>
              <div className="font-semibold">{formatDate(surveyDetail.deadline)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Owner
              </div>
              <div className="font-semibold">{surveyDetail.owner}</div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <div className="font-semibold">{formatDate(surveyDetail.createdAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Assigned */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {surveyKPI?.totalAssigned || 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {surveyKPI?.completed || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCompletionRate()}% completion rate
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Completion Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {surveyKPI ? formatCompletionTime(surveyKPI.avgCompletionTime) : '0h'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Last Submission */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Submission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-sm">
                {surveyKPI?.lastSubmissionDate ? (
                  formatDate(surveyKPI.lastSubmissionDate)
                ) : (
                  <span className="text-muted-foreground">No submissions yet</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress Bar */}
      {surveyKPI && surveyKPI.totalAssigned > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{getCompletionRate()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionRate()}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {surveyKPI.completed} of {surveyKPI.totalAssigned} responses completed
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SurveyHeader;

