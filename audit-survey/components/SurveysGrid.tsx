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
import { Eye, BarChart3, Calendar, Users, TrendingUp } from 'lucide-react';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSurveysRequest } from '../store/surveySlice';
import { SurveySummary } from '../types/survey';

interface SurveysGridProps {
  onViewSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

const SurveysGrid: React.FC<SurveysGridProps> = ({
  onViewSurvey,
  onViewResults
}) => {
  const dispatch = useDispatch();
  const { adminSurveys, adminSurveysLoading, adminSurveysError } = useSelector(
    (state: RootState) => state.survey
  );

  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAdminSurveysRequest());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'DRAFT': 'bg-yellow-100 text-yellow-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getCompletionRate = (completionCount: number, totalAssignments: number) => {
    if (totalAssignments === 0) return '0%';
    return `${Math.round((completionCount / totalAssignments) * 100)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columnDefs: ColDef[] = [
    {
      headerName: 'Survey Title',
      field: 'title',
      flex: 2,
      cellRenderer: (params: any) => (
        <div className="font-medium text-blue-600 cursor-pointer hover:underline">
          {params.value}
        </div>
      ),
      onCellClicked: (params: CellClickedEvent) => {
        onViewSurvey(params.data.id);
      }
    },
    {
      headerName: 'Project',
      field: 'project',
      flex: 1.5,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith']
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      cellRenderer: (params: any) => getStatusBadge(params.value),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['ACTIVE', 'DRAFT', 'CLOSED']
      }
    },
    {
      headerName: 'Deadline',
      field: 'deadline',
      flex: 1.2,
      cellRenderer: (params: any) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Completion Rate',
      flex: 1.2,
      cellRenderer: (params: any) => {
        const rate = getCompletionRate(params.data.completionCount, params.data.totalAssignments);
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{rate}</span>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: rate }}
              />
            </div>
          </div>
        );
      },
      comparator: (valueA: any, valueB: any) => {
        const rateA = parseFloat(valueA.replace('%', ''));
        const rateB = parseFloat(valueB.replace('%', ''));
        return rateA - rateB;
      }
    },
    {
      headerName: 'Responses',
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{params.data.completionCount}/{params.data.totalAssignments}</span>
        </div>
      )
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      flex: 1.2,
      cellRenderer: (params: any) => formatDate(params.value),
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Actions',
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewSurvey(params.data.id)}
            className="h-8 px-2"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          {params.data.status === 'ACTIVE' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewResults(params.data.id)}
              className="h-8 px-2"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Results
            </Button>
          )}
        </div>
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
        fileName: 'surveys-export.csv',
        columnKeys: ['title', 'project', 'status', 'deadline', 'completionCount', 'totalAssignments', 'createdAt']
      });
    }
  };

  if (adminSurveysLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Surveys</CardTitle>
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

  if (adminSurveysError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{adminSurveysError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Surveys
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
      </CardHeader>
      <CardContent>
        <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowData={adminSurveys}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            animateRows={true}
            rowSelection="single"
            suppressRowClickSelection={true}
            onRowClicked={(event) => {
              // Handle row click if needed
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveysGrid;
