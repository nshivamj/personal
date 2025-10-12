import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, Settings, RotateCcw } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import SurveyDetailPage from './components/SurveyDetailPage';
import { CreateSurveyRequest } from './types/survey';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createSurveyRequest } from './store/surveySlice';

type ViewMode = 'admin' | 'user';
type AdminView = 'dashboard' | 'create' | 'details' | 'results';
type UserView = 'dashboard' | 'take-survey' | 'view-response';

const AuditSurveyPage: React.FC = () => {
  const dispatch = useDispatch();
  const { createSurveyLoading } = useSelector((state: RootState) => state.survey);
  const { username, firstName, lastName } = useSelector((state: RootState) => state.auth);

  // Determine user role - in real app this would come from auth state
  // For now, we'll simulate different roles based on URL params or user data
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  
  // Default to USER role unless explicitly set to ADMIN
  const userRole =  'ADMIN';
  
  const [viewMode, setViewMode] = useState<ViewMode>(userRole === 'ADMIN' ? 'admin' : 'user');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [userView, setUserView] = useState<UserView>('dashboard');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const [dashboardViewMode, setDashboardViewMode] = useState<'card' | 'table'>('card');


  // Admin handlers
  const handleCreateSurvey = () => {
    setAdminView('create');
  };

  const handleViewSurvey = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setAdminView('details');
  };

  const handleViewResults = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setAdminView('results');
  };

  const handleBackToDashboard = () => {
    setAdminView('dashboard');
    setSelectedSurveyId('');
  };

  const handleSubmitSurvey = (data: CreateSurveyRequest) => {
    dispatch(createSurveyRequest(data));
    setAdminView('dashboard');
  };


  const renderAdminContent = () => {
    switch (adminView) {
      case 'create':
        return (
          <CreateSurveyModal
            open={true}
            onClose={() => setAdminView('dashboard')}
            onSubmit={handleSubmitSurvey}
            loading={createSurveyLoading}
          />
        );

      case 'details':
        return (
          <SurveyDetailPage />
        );

      case 'results':
        return (
          <SurveyDetailPage />
        );

      default:
        return (
          <AdminDashboard
            onCreateSurvey={handleCreateSurvey}
            onViewSurvey={handleViewSurvey}
            onViewResults={handleViewResults}
            viewMode={dashboardViewMode}
            onToggleView={() => setDashboardViewMode(dashboardViewMode === 'card' ? 'table' : 'card')}
          />
        );
    }
  };



  return (
    <div className="container mx-auto px-4 py-6">
      {/* Role Indicator and Switcher */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            Audit Survey System
          </h1>
        </div>
      </div>

      {renderAdminContent()}
    </div>
  );
};

export default AuditSurveyPage;
