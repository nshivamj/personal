import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Eye, ExternalLink } from 'lucide-react';
import { SurveyAssignment } from '../store/surveyStore';
import { useSurveyStore } from '../store/surveyStore';

interface AssignmentsTableProps {
  assignments: SurveyAssignment[];
  isLoading: boolean;
}

type SortField = 'assignee' | 'status' | 'emailStatus' | 'assignedAt' | 'submittedAt';
type SortDirection = 'asc' | 'desc';

const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  isLoading
}) => {
  const [sortField, setSortField] = useState<SortField>('assignedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { openResponseModal } = useSurveyStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort data
  const processedAssignments = useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const matchesStatus = statusFilter === 'ALL' || assignment.status === statusFilter;
      const matchesSearch = assignment.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.assigneeName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date fields
      if (sortField === 'assignedAt' || sortField === 'submittedAt') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [assignments, sortField, sortDirection, statusFilter, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (assignment: SurveyAssignment) => {
    openResponseModal(assignment);
  };

  const statusOptions = ['ALL', 'PENDING', 'DRAFT', 'SUBMITTED', 'DISCARDED'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Assignments ({assignments.length})
        </CardTitle>
        <CardDescription>Survey assignments and their status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('assignee')}
                  >
                    Assignee
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('emailStatus')}
                  >
                    Email Status
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('assignedAt')}
                  >
                    Assigned
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('submittedAt')}
                  >
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processedAssignments.map((assignment) => (
                  <tr 
                    key={assignment.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(assignment)}
                  >
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{assignment.assigneeName || assignment.assignee}</div>
                        <div className="text-xs text-gray-500">{assignment.assignee}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getStatusColor(assignment.status)} border`}>
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={getEmailStatusColor(assignment.emailStatus)}>
                        {assignment.emailStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {formatDate(assignment.assignedAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {assignment.submittedAt ? formatDate(assignment.submittedAt) : '-'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(assignment);
                          }}
                          className="h-8 px-3"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {assignment.status === 'SUBMITTED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 px-3"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Full Page
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {processedAssignments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {assignments.length === 0 ? (
                  <div>
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No assignments found</p>
                    <p className="text-sm">This survey has no assignments yet</p>
                  </div>
                ) : (
                  <div>
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No assignments match the current filter</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-500">
          Showing {processedAssignments.length} of {assignments.length} assignments
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentsTable;