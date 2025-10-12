import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, Clock, CheckCircle, Brain } from 'lucide-react';
import { SurveySummary } from '../store/surveyStore';

interface ResultsSummaryProps {
  summary: SurveySummary | null;
  isLoading: boolean;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  summary,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
    if (!summary) return 0;
    return Math.round((summary.completedCount / summary.totalCount) * 100);
  };

  const getOptionPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const renderQuestionBreakdown = (question: any) => {
    const { responses, totalResponses } = question;
    
    return (
      <div key={question.questionId} className="space-y-3">
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{question.questionText}</h4>
          <Badge variant="outline" className="text-xs">
            {question.questionType.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {Object.entries(responses).map(([option, count]) => {
            const percentage = getOptionPercentage(count as number, totalResponses);
            return (
              <div key={option} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{option}</span>
                  <span className="text-gray-500">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Results Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Results Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Results Summary
          </CardTitle>
          <CardDescription>Aggregated statistics from survey responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{getCompletionRate()}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.completedCount}</div>
              <div className="text-sm text-gray-600">Responses</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCompletionTime(summary.avgCompletionTime)}
              </div>
              <div className="text-sm text-gray-600">Avg Time</div>
            </div>
          </div>

          {/* Last Submission */}
          {summary.lastSubmissionDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last submission: {formatDate(summary.lastSubmissionDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      {summary.questionBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Question Analysis
            </CardTitle>
            <CardDescription>Per-question response breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {summary.questionBreakdown.map(renderQuestionBreakdown)}
          </CardContent>
        </Card>
      )}

      {/* AI Summary Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Summary
          </CardTitle>
          <CardDescription>Automated insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">AI Summary Coming Soon</p>
            <p className="text-sm text-gray-400">
              This feature will provide automated insights and recommendations based on survey responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSummary;

