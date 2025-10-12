import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, BarChart3, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { SurveySummary } from '../types/survey';

interface SurveysTableProps {
  surveys: SurveySummary[];
  onViewSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

type SortField = 'title' | 'project' | 'status' | 'deadline' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const SurveysTable: React.FC<SurveysTableProps> = ({
  surveys,
  onViewSurvey,
  onViewResults
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Completion percentage helper
  const getCompletionPercentage = (survey: SurveySummary) => {
    if (survey.totalAssignments === 0) return 0;
    return Math.round((survey.completionCount / survey.totalAssignments) * 100);
  };

  // Sort and filter data
  const processedSurveys = useMemo(() => {
    let filtered = surveys.filter(survey => 
      statusFilter === 'ALL' || survey.status === statusFilter
    );

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date fields
      if (sortField === 'deadline' || sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
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
  }, [surveys, sortField, sortDirection, statusFilter]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const statusOptions = ['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'];

  return (
    <div className="w-full space-y-4">
      {/* Debug Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Table Info:</strong> {surveys.length} total surveys, showing {processedSurveys.length} after filtering
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Survey Title
                    <SortIcon field="title" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('project')}
                >
                  <div className="flex items-center gap-2">
                    Project
                    <SortIcon field="project" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('deadline')}
                >
                  <div className="flex items-center gap-2">
                    Deadline
                    <SortIcon field="deadline" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Completion
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">{survey.title}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{survey.project}</td>
                  <td className="px-4 py-4">
                    <Badge className={`${getStatusColor(survey.status)} border`}>
                      {survey.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{formatDate(survey.deadline)}</td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{getCompletionPercentage(survey)}%</span>
                        <span className="text-gray-500">
                          {survey.completionCount}/{survey.totalAssignments}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${getCompletionPercentage(survey)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{formatDate(survey.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSurvey(survey.id)}
                        className="h-8 px-3"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details & Results
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {processedSurveys.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {surveys.length === 0 ? (
                <div>
                  <p className="text-lg font-medium mb-2">No surveys found</p>
                  <p className="text-sm">Create your first survey to get started</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">No surveys match the current filter</p>
                  <p className="text-sm">Try changing the status filter</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        Showing {processedSurveys.length} of {surveys.length} surveys
      </div>
    </div>
  );
};

export default SurveysTable;