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
import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignmentsRequest } from '../store/surveySlice';
import { SurveyAssignment } from '../types/survey';

interface AssignmentsGridProps {
  surveyId: string;
}

const AssignmentsGrid: React.FC<AssignmentsGridProps> = ({ surveyId }) => {
  const dispatch = useDispatch();
  const { assignments, assignmentsLoading, assignmentsError } = useSelector(
    (state: RootState) => state.survey
  );

  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    if (surveyId) {
      dispatch(fetchAssignmentsRequest(surveyId));
    }
  }, [dispatch, surveyId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'COMPLETED': { 
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3 mr-1" />
      },
      'PENDING': { 
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3 mr-1" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge className={config.className}>
        {config.icon}
        {status}
      </Badge>
    );
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

  const getDaysSinceAssigned = (assignedAt: string) => {
    const assigned = new Date(assignedAt);
    const now = new Date();
    const diffTime = now.getTime() - assigned.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityLevel = (assignment: SurveyAssignment) => {
    const daysSinceAssigned = getDaysSinceAssigned(assignment.assignedAt);
    
    if (assignment.status === 'COMPLETED') {
      return { level: 'completed', color: 'text-green-600', icon: <CheckCircle className="h-4 w-4" /> };
    }
    
    if (daysSinceAssigned >= 7) {
      return { level: 'overdue', color: 'text-red-600', icon: <AlertTriangle className="h-4 w-4" /> };
    }
    
    if (daysSinceAssigned >= 3) {
      return { level: 'urgent', color: 'text-yellow-600', icon: <Clock className="h-4 w-4" /> };
    }
    
    return { level: 'normal', color: 'text-gray-600', icon: <Clock className="h-4 w-4" /> };
  };

  const columnDefs: ColDef[] = [
    {
      headerName: 'User ID',
      field: 'userId',
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{params.value}</span>
        </div>
      ),
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains', 'startsWith', 'endsWith']
      }
    },
    {
      headerName: 'Role',
      field: 'userRole',
      flex: 1.2,
      cellRenderer: (params: any) => (
        <Badge variant="outline">{params.value}</Badge>
      ),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER', 'DEVOPS_ENGINEER', 'PROJECT_MANAGER', 'ADMIN']
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      cellRenderer: (params: any) => getStatusBadge(params.value),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['PENDING', 'COMPLETED']
      }
    },
    {
      headerName: 'Priority',
      flex: 1,
      cellRenderer: (params: any) => {
        const priority = getPriorityLevel(params.data);
        return (
          <div className={`flex items-center gap-1 ${priority.color}`}>
            {priority.icon}
            <span className="capitalize">{priority.level}</span>
          </div>
        );
      },
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['completed', 'normal', 'urgent', 'overdue']
      }
    },
    {
      headerName: 'Assigned Date',
      field: 'assignedAt',
      flex: 1.5,
      cellRenderer: (params: any) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Days Since Assigned',
      flex: 1.2,
      cellRenderer: (params: any) => {
        const days = getDaysSinceAssigned(params.data.assignedAt);
        const priority = getPriorityLevel(params.data);
        
        return (
          <div className={`flex items-center gap-1 ${priority.color}`}>
            <span className="font-medium">{days}</span>
            <span className="text-xs">days</span>
          </div>
        );
      },
      comparator: (valueA: any, valueB: any) => {
        const daysA = parseInt(valueA);
        const daysB = parseInt(valueB);
        return daysA - daysB;
      }
    },
    {
      headerName: 'Completed Date',
      field: 'completedAt',
      flex: 1.5,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground">-</span>;
        return formatDate(params.value);
      },
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Response Time',
      flex: 1.2,
      cellRenderer: (params: any) => {
        if (!params.data.completedAt) return <span className="text-muted-foreground">-</span>;
        
        const assigned = new Date(params.data.assignedAt);
        const completed = new Date(params.data.completedAt);
        const diffTime = completed.getTime() - assigned.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{diffDays}</span>
            <span className="text-xs">days</span>
          </div>
        );
      }
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
        fileName: `assignments-${surveyId}.csv`,
        columnKeys: ['userId', 'userRole', 'status', 'assignedAt', 'completedAt']
      });
    }
  };

  const getStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'COMPLETED').length;
    const pending = assignments.filter(a => a.status === 'PENDING').length;
    const overdue = assignments.filter(a => {
      if (a.status === 'COMPLETED') return false;
      const days = getDaysSinceAssigned(a.assignedAt);
      return days >= 7;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  if (assignmentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
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

  if (assignmentsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{assignmentsError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Assignments
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
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={assignments}
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
              const priority = getPriorityLevel(params.data);
              switch (priority.level) {
                case 'overdue': return 'bg-red-50';
                case 'urgent': return 'bg-yellow-50';
                case 'completed': return 'bg-green-50';
                default: return '';
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentsGrid;
