import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { RootState } from '@/store';
import { fetchQuestionsRequest, submitResponseRequest } from '../store/surveySlice';
import { Question, Answer } from '../types/survey';

interface TakeSurveyProps {
  surveyId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const TakeSurvey: React.FC<TakeSurveyProps> = ({
  surveyId,
  onBack,
  onSuccess
}) => {
  const dispatch = useDispatch();
  const { questions, questionsLoading, questionsError, submitResponseLoading } = useSelector(
    (state: RootState) => state.survey
  );

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock user role - in real app this would come from auth state
  const userRole = 'DEVELOPER';

  useEffect(() => {
    dispatch(fetchQuestionsRequest(surveyId));
  }, [dispatch, surveyId]);

  const filteredQuestions = questions.filter(q => 
    q.targetRoles.includes(userRole)
  );

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answerArray: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? value : [value],
      textValue: typeof value === 'string' && !currentQuestion?.options?.includes(value) ? value : undefined
    }));

    dispatch(submitResponseRequest({ surveyId, answers: answerArray }));
    
    // Show success message
    setShowSuccess(true);
    
    // Navigate back after delay
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    
    if (currentQuestion.type === 'CHECKBOX') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    return answer && answer.toString().trim() !== '';
  };

  const getProgress = () => {
    return Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100);
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const answer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'RADIO':
        return (
          <RadioGroup
            value={answer as string || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'CHECKBOX':
        const selectedValues = (answer as string[]) || [];
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAnswerChange(currentQuestion.id, [...selectedValues, option]);
                    } else {
                      handleAnswerChange(currentQuestion.id, selectedValues.filter(v => v !== option));
                    }
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'SCALE':
        return (
          <RadioGroup
            value={answer as string || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            className="flex flex-wrap gap-2"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'TEXT':
        return (
          <Textarea
            value={answer as string || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Enter your response..."
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-center mb-4">
              Your survey response has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              You will be redirected back to your dashboard shortly...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questionsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{questionsError}</AlertDescription>
      </Alert>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
            <p className="text-muted-foreground text-center mb-4">
              There are no questions in this survey that match your role.
            </p>
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Survey Questions</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{getProgress()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {currentQuestion?.text}
            </CardTitle>
            {currentQuestion?.required && (
              <Badge variant="destructive">Required</Badge>
            )}
          </div>
          <CardDescription>
            {currentQuestion?.type} • Target roles: {currentQuestion?.targetRoles.join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestionInput()}
          
          {currentQuestion?.required && !isCurrentQuestionAnswered() && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This question is required. Please provide an answer before continuing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestionIndex < filteredQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={currentQuestion?.required && !isCurrentQuestionAnswered()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={currentQuestion?.required && !isCurrentQuestionAnswered() || submitResponseLoading}
            >
              {submitResponseLoading ? 'Submitting...' : 'Submit Survey'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeSurvey;
