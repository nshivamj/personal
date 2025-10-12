import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Calendar, User, CheckCircle, Clock, X } from 'lucide-react';
import { SurveyAssignment, SurveyResponse } from '../store/surveyStore';
import { useSurveyStore } from '../store/surveyStore';

interface ResponseModalProps {
  assignment: SurveyAssignment;
  surveyId: string;
  onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  assignment,
  surveyId,
  onClose
}) => {
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchSurveyResponse } = useSurveyStore();

  useEffect(() => {
    if (assignment.status === 'SUBMITTED') {
      setIsLoading(true);
      fetchSurveyResponse(surveyId, assignment.assignee)
        .then((data) => {
          setResponse(data);
          setError(null);
        })
        .catch((err) => {
          setError('Failed to load response');
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [assignment, surveyId, fetchSurveyResponse]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DISCARDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderAnswer = (answer: any) => {
    return (
      <div key={answer.questionId} className="border rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-sm">{answer.questionText}</h4>
        
        <div className="space-y-2">
          {answer.selectedOptions && answer.selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {answer.selectedOptions.map((option: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {option}
                </Badge>
              ))}
            </div>
          )}
          
          {answer.scaleValue && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <Badge variant="outline">{answer.scaleValue}/5</Badge>
            </div>
          )}
          
          {answer.answerText && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{answer.answerText}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleOpenFullPage = () => {
    // Navigate to full page response view
    window.open(`/surveys/${surveyId}/responses/${assignment.assignee}`, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <div>
                <div className="font-semibold">{assignment.assigneeName || assignment.assignee}</div>
                <div className="text-sm text-gray-500 font-normal">{assignment.assignee}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Survey response details for {assignment.assigneeName || assignment.assignee}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Status */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4" />
                Submission Status
              </div>
              <Badge className={`${getStatusColor(assignment.status)} border`}>
                {assignment.status}
              </Badge>
            </div>
            
            {assignment.submittedAt && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Submitted At
                </div>
                <div className="text-sm font-medium">{formatDate(assignment.submittedAt)}</div>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Assigned At
              </div>
              <div className="text-sm font-medium">{formatDate(assignment.assignedAt)}</div>
            </div>
          </div>

          {/* Response Content */}
          {assignment.status === 'SUBMITTED' ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : response ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Response Details</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleOpenFullPage}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Full Page
                      </Button>
                    </div>
                  </div>
                  
                  {response.answers.map(renderAnswer)}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No response data available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="space-y-4">
                {assignment.status === 'DRAFT' ? (
                  <>
                    <Clock className="h-12 w-12 mx-auto text-yellow-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Response in Progress</h3>
                      <p className="text-gray-500">This assignee has started but not completed the survey yet.</p>
                    </div>
                  </>
                ) : assignment.status === 'PENDING' ? (
                  <>
                    <Clock className="h-12 w-12 mx-auto text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Response Pending</h3>
                      <p className="text-gray-500">This assignee has not started the survey yet.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="h-12 w-12 mx-auto text-red-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Response Discarded</h3>
                      <p className="text-gray-500">This assignment has been discarded and no response will be submitted.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseModal;

