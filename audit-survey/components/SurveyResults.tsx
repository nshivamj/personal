import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, ArrowLeft, TrendingUp, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { RootState } from '@/store';
import { fetchResultsRequest, fetchResponsesRequest, fetchAssignmentsRequest } from '../store/surveySlice';
import AssignmentsGrid from './AssignmentsGrid';
import ResponsesGrid from './ResponsesGrid';

interface SurveyResultsProps {
  surveyId: string;
  onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SurveyResults: React.FC<SurveyResultsProps> = ({
  surveyId,
  onBack
}) => {
  const dispatch = useDispatch();
  const { 
    results, 
    resultsLoading, 
    resultsError,
    assignments,
    responses 
  } = useSelector((state: RootState) => state.survey);

  useEffect(() => {
    dispatch(fetchResultsRequest(surveyId));
    dispatch(fetchResponsesRequest(surveyId));
    dispatch(fetchAssignmentsRequest(surveyId));
  }, [dispatch, surveyId]);

  const handleExportCSV = () => {
    // Mock export functionality
    console.log('Exporting results to CSV...');
  };

  const getCompletionRate = () => {
    if (!assignments.length) return 0;
    const completed = assignments.filter(a => a.status === 'COMPLETED').length;
    return Math.round((completed / assignments.length) * 100);
  };

  const getResponseTimeStats = () => {
    const completedAssignments = assignments.filter(a => a.status === 'COMPLETED' && a.completedAt);
    
    if (completedAssignments.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const responseTimes = completedAssignments.map(assignment => {
      const assigned = new Date(assignment.assignedAt);
      const completed = new Date(assignment.completedAt!);
      return Math.floor((completed.getTime() - assigned.getTime()) / (1000 * 60 * 60 * 24));
    });
    
    const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    const min = Math.min(...responseTimes);
    const max = Math.max(...responseTimes);
    
    return { avg, min, max };
  };

  const responseTimeStats = getResponseTimeStats();

  const prepareChartData = () => {
    if (!results?.aggregatedData) return [];

    // Get the first question data for demonstration
    const firstQuestionId = Object.keys(results.aggregatedData)[0];
    if (!firstQuestionId) return [];

    const questionData = results.aggregatedData[firstQuestionId];
    return Object.entries(questionData).map(([option, count]) => ({
      option,
      count,
      percentage: Math.round((count as number / results.totalResponses) * 100)
    }));
  };

  const chartData = prepareChartData();

  if (resultsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (resultsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{resultsError}</AlertDescription>
      </Alert>
    );
  }

  if (!results) {
    return (
      <Alert>
        <AlertDescription>No results available for this survey</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Survey Details
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Survey Results</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis and reporting for survey responses
          </p>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              {results.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {getCompletionRate()}% of assignments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseTimeStats.avg}</div>
            <p className="text-xs text-muted-foreground">
              days to complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Range</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseTimeStats.min}-{responseTimeStats.max}</div>
            <p className="text-xs text-muted-foreground">
              days range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Distribution</CardTitle>
                <CardDescription>
                  Distribution of responses across different options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Percentages</CardTitle>
                <CardDescription>
                  Percentage breakdown of responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ option, percentage }) => `${option}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Question Analysis</CardTitle>
              <CardDescription>
                Comprehensive breakdown of all survey questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(results.aggregatedData).map(([questionId, questionData], index) => (
                  <div key={questionId} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Question {index + 1}</h4>
                    <div className="grid gap-2">
                      {Object.entries(questionData).map(([option, count]) => {
                        const percentage = Math.round((count as number / results.totalResponses) * 100);
                        return (
                          <div key={option} className="flex items-center justify-between">
                            <span className="text-sm">{option}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-16">
                                {count} ({percentage}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsGrid surveyId={surveyId} />
        </TabsContent>

        <TabsContent value="responses">
          <ResponsesGrid surveyId={surveyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyResults;
