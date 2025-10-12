import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText, User, Calendar, Hash } from 'lucide-react';
import { SurveyTemplate } from '../store/surveyStore';
import { useSurveyStore } from '../store/surveyStore';

interface TemplateInfoProps {
  template: SurveyTemplate | null;
  isLoading: boolean;
}

const TemplateInfo: React.FC<TemplateInfoProps> = ({
  template,
  isLoading
}) => {
  const { templateExpanded, toggleTemplateExpanded } = useSurveyStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'bg-blue-100 text-blue-800';
      case 'TEXT':
        return 'bg-green-100 text-green-800';
      case 'SCALE':
        return 'bg-purple-100 text-purple-800';
      case 'CHECKBOX':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return '○';
      case 'TEXT':
        return '📝';
      case 'SCALE':
        return '📊';
      case 'CHECKBOX':
        return '☑️';
      default:
        return '❓';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!template) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Template Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No template information available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Template Information
        </CardTitle>
        <CardDescription>Survey template details and questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Template Name:</span>
            <span className="text-sm">{template.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Version:</span>
            <Badge variant="outline">{template.version}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Created By:</span>
            <span className="text-sm">{template.createdBy}</span>
          </div>
        </div>

        {/* Questions Collapsible */}
        <Collapsible open={templateExpanded} onOpenChange={toggleTemplateExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Questions ({template.questions.length})
              </span>
              {templateExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-4">
            {template.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                      <Badge className={`${getQuestionTypeColor(question.type)} text-xs`}>
                        {question.type.replace('_', ' ')}
                      </Badge>
                      {question.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    
                    <p className="font-medium text-sm">{question.text}</p>
                    
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Options:</p>
                        <div className="flex flex-wrap gap-1">
                          {question.options.map((option, optIndex) => (
                            <Badge key={optIndex} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default TemplateInfo;

