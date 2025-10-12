import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, User, Calendar, Eye } from 'lucide-react';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResponsesRequest } from '../store/surveySlice';
import { SurveyResponse } from '../types/survey';

interface ResponsesGridProps {
  surveyId: string;
  onViewResponse?: (responseId: string) => void;
}

const ResponsesGrid: React.FC<ResponsesGridProps> = ({ 
  surveyId, 
  onViewResponse 
}) => {
  const dispatch = useDispatch();
  const { responses, responsesLoading, responsesError } = useSelector(
    (state: RootState) => state.survey
  );

  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    if (surveyId) {
      dispatch(fetchResponsesRequest(surveyId));
    }
  }, [dispatch, surveyId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnswerSummary = (answers: any[]) => {
    if (!answers || answers.length === 0) return 'No answers';
    
    const summary = answers.map(answer => {
      if (Array.isArray(answer.value)) {
        return answer.value.join(', ');
      }
      return answer.value || answer.textValue || 'No answer';
    }).join('; ');
    
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  };

  const getResponseTime = (submittedAt: string) => {
    const submitted = new Date(submittedAt);
    const now = new Date();
    const diffTime = now.getTime() - submitted.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: 'User',
      flex: 1.2,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">
              {params.data.isAnonymous ? 'Anonymous User' : params.data.userId}
            </div>
            <div className="text-xs text-muted-foreground">
              {params.data.userRole}
            </div>
          </div>
        </div>
      ),
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith']
      }
    },
    {
      headerName: 'Answers Summary',
      flex: 3,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">{getAnswerSummary(params.data.answers)}</span>
        </div>
      ),
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Submitted',
      field: 'submittedAt',
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div>
          <div className="text-sm">{formatDate(params.value)}</div>
          <div className="text-xs text-muted-foreground">
            {getResponseTime(params.value)}
          </div>
        </div>
      ),
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Answer Count',
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge variant="outline">
          {params.data.answers?.length || 0} answers
        </Badge>
      )
    },
    {
      headerName: 'Response Type',
      field: 'isAnonymous',
      flex: 1,
      cellRenderer: (params: any) => (
        <Badge variant={params.value ? "secondary" : "default"}>
          {params.value ? 'Anonymous' : 'Named'}
        </Badge>
      ),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [true, false]
      }
    },
    {
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewResponse?.(params.data.id)}
          className="h-8 px-2"
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      ),
      sortable: false,
      filter: false
    }
  ];

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const quickFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const exportToCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `responses-${surveyId}.csv`,
        columnKeys: ['userId', 'userRole', 'submittedAt', 'isAnonymous']
      });
    }
  };

  const getStats = () => {
    const total = responses.length;
    const anonymous = responses.filter(r => r.isAnonymous).length;
    const named = responses.filter(r => !r.isAnonymous).length;
    
    // Calculate average response time (mock calculation)
    const avgResponseTime = total > 0 ? '2.5 hours' : 'N/A';
    
    return { total, anonymous, named, avgResponseTime };
  };

  const stats = getStats();

  if (responsesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (responsesError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{responsesError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Survey Responses
          </CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Quick filter..."
              onChange={quickFilter}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
            <Button variant="outline" size="sm" onClick={exportToCsv}>
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.named}</div>
            <div className="text-sm text-muted-foreground">Named</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.anonymous}</div>
            <div className="text-sm text-muted-foreground">Anonymous</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={responses}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 25, 50]}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            animateRows={true}
            rowSelection="single"
            suppressRowClickSelection={true}
            getRowClass={(params) => {
              return params.data.isAnonymous ? 'bg-gray-50' : '';
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsesGrid;
