import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, Settings, RotateCcw } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CreateSurveyModal from './components/CreateSurveyModal';
import SurveyDetails from './components/SurveyDetails';
import SurveyResults from './components/SurveyResults';
import SurveyDetailPage from './components/SurveyDetailPage';
import TakeSurvey from './components/TakeSurvey';
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
  const userRole = roleParam === 'admin' ? 'ADMIN' : 'USER';
  
  const [viewMode, setViewMode] = useState<ViewMode>(userRole === 'ADMIN' ? 'admin' : 'user');
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [userView, setUserView] = useState<UserView>('dashboard');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const [dashboardViewMode, setDashboardViewMode] = useState<'card' | 'table'>('card');

  // Function to switch between admin and user views for testing
  const switchRole = () => {
    const newRole = userRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('role', newRole.toLowerCase());
    window.history.replaceState({}, '', newUrl.toString());
    window.location.reload(); // Simple reload to apply new role
  };

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

  // User handlers
  const handleTakeSurvey = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setUserView('take-survey');
  };

  const handleViewSubmittedSurvey = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setUserView('view-response');
  };

  const handleSurveySubmitted = () => {
    setUserView('dashboard');
    setSelectedSurveyId('');
  };

  const handleBackToUserDashboard = () => {
    setUserView('dashboard');
    setSelectedSurveyId('');
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

  const renderUserContent = () => {
    switch (userView) {
      case 'take-survey':
        return (
          <TakeSurvey
            surveyId={selectedSurveyId}
            onBack={handleBackToUserDashboard}
            onSuccess={handleSurveySubmitted}
          />
        );
      
      case 'view-response':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button 
                onClick={handleBackToUserDashboard}
                className="text-blue-600 hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Response Submitted</h2>
              <p className="text-green-700">
                Your survey response has been successfully submitted and saved.
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <UserDashboard
            onTakeSurvey={handleTakeSurvey}
            onViewSubmittedSurvey={handleViewSubmittedSurvey}
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
          <Badge variant={userRole === 'ADMIN' ? 'default' : 'secondary'}>
            {userRole === 'ADMIN' ? 'Admin View' : 'User View'}
          </Badge>
        </div>
        <Button variant="outline" onClick={switchRole} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Switch to {userRole === 'ADMIN' ? 'User' : 'Admin'} View
        </Button>
      </div>

      {/* Role-based Navigation */}
      {userRole === 'ADMIN' && (
        <Tabs value={adminView} onValueChange={(value) => setAdminView(value as AdminView)}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Create Survey
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            {renderAdminContent()}
          </TabsContent>
          
          <TabsContent value="create">
            {adminView === 'create' && renderAdminContent()}
          </TabsContent>
        </Tabs>
      )}

      {userRole === 'USER' && (
        <Tabs value={userView} onValueChange={(value) => setUserView(value as UserView)}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Surveys
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            {renderUserContent()}
          </TabsContent>
        </Tabs>
      )}

      {/* Direct rendering for non-tab views */}
      {(adminView === 'details' || adminView === 'results' || userView === 'take-survey' || userView === 'view-response') && (
        <div>
          {viewMode === 'admin' ? renderAdminContent() : renderUserContent()}
        </div>
      )}
    </div>
  );
};

export default AuditSurveyPage;
