import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Users, X, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateSurveyRequest, UserAssignment } from '../types/survey';
import { SURVEY_TEMPLATES, PROJECTS, USER_ROLES } from '../constants/templates';

interface CreateSurveyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSurveyRequest) => void;
  loading?: boolean;
}

const CreateSurveyModal: React.FC<CreateSurveyModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [newUserId, setNewUserId] = useState('');
  const [newUserRoles, setNewUserRoles] = useState<string[]>([]);

  const selectedTemplateData = SURVEY_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleAddAssignment = () => {
    if (newUserId && newUserRoles.length > 0) {
      const newAssignment: UserAssignment = {
        userId: newUserId,
        roles: [...newUserRoles]
      };
      setAssignments([...assignments, newAssignment]);
      setNewUserId('');
      setNewUserRoles([]);
    }
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleToggleRole = (role: string) => {
    if (newUserRoles.includes(role)) {
      setNewUserRoles(newUserRoles.filter(r => r !== role));
    } else {
      setNewUserRoles([...newUserRoles, role]);
    }
  };

  const handleSubmit = () => {
    if (!title || !project || !deadline || !selectedTemplate || assignments.length === 0) {
      return;
    }

    const data: CreateSurveyRequest = {
      title,
      project,
      deadline: deadline.toISOString().split('T')[0],
      isAnonymous,
      templateId: selectedTemplate,
      assignments
    };

    onSubmit(data);
  };

  const handleClose = () => {
    setTitle('');
    setProject('');
    setDeadline(undefined);
    setIsAnonymous(false);
    setSelectedTemplate('');
    setAssignments([]);
    setNewUserId('');
    setNewUserRoles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Set up a new audit survey for your project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Survey Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q4 Security Audit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECTS.map((proj) => (
                    <SelectItem key={proj} value={proj}>
                      {proj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous">Anonymous responses</Label>
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <Label>Survey Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {SURVEY_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplateData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedTemplateData.name}</CardTitle>
                  <CardDescription>{selectedTemplateData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">Questions ({selectedTemplateData.questions.length})</h4>
                    <div className="space-y-1">
                      {selectedTemplateData.questions.map((question, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {question.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Assignments */}
          <div className="space-y-4">
            <Label>Assign Users</Label>
            
            {/* Add New Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add User Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {USER_ROLES.map((role) => (
                      <Badge
                        key={role}
                        variant={newUserRoles.includes(role) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleRole(role)}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddAssignment} disabled={!newUserId || newUserRoles.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </CardContent>
            </Card>

            {/* Current Assignments */}
            {assignments.length > 0 && (
              <div className="space-y-2">
                <Label>Current Assignments ({assignments.length})</Label>
                <div className="space-y-2">
                  {assignments.map((assignment, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">{assignment.userId}</div>
                          <div className="flex gap-1 mt-1">
                            {assignment.roles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAssignment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation */}
          {(!title || !project || !deadline || !selectedTemplate || assignments.length === 0) && (
            <Alert>
              <AlertDescription>
                Please fill in all required fields and add at least one user assignment.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !title || !project || !deadline || !selectedTemplate || assignments.length === 0}
            >
              {loading ? 'Creating...' : 'Create Survey'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSurveyModal;
