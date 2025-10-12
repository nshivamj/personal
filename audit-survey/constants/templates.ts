import { SurveyTemplate } from '../types/survey';

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: 'security-audit',
    name: 'Security Audit Template',
    description: 'Comprehensive security assessment for development teams',
    questions: [
      {
        text: 'How often do you review security vulnerabilities in dependencies?',
        type: 'RADIO',
        options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Never'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
        order: 1
      },
      {
        text: 'Which security practices do you follow? (Select all that apply)',
        type: 'CHECKBOX',
        options: [
          'Code reviews for security',
          'Automated security scanning',
          'Dependency vulnerability checks',
          'Security training completion',
          'Incident response procedures'
        ],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
        order: 2
      },
      {
        text: 'Rate your confidence in identifying security vulnerabilities (1-10)',
        type: 'SCALE',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
        order: 3
      },
      {
        text: 'Describe any security concerns you have with current practices',
        type: 'TEXT',
        required: false,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'SECURITY_ENGINEER'],
        order: 4
      }
    ]
  },
  {
    id: 'code-quality',
    name: 'Code Quality Assessment',
    description: 'Evaluation of code quality practices and standards',
    questions: [
      {
        text: 'How satisfied are you with the current code review process?',
        type: 'RADIO',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER'],
        order: 1
      },
      {
        text: 'Which code quality tools are currently in use?',
        type: 'CHECKBOX',
        options: [
          'ESLint',
          'Prettier',
          'SonarQube',
          'CodeClimate',
          'Custom linting rules',
          'None'
        ],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER'],
        order: 2
      },
      {
        text: 'Rate the overall code quality in your team (1-10)',
        type: 'SCALE',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER'],
        order: 3
      },
      {
        text: 'What improvements would you suggest for code quality?',
        type: 'TEXT',
        required: false,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER'],
        order: 4
      }
    ]
  },
  {
    id: 'process-evaluation',
    name: 'Development Process Evaluation',
    description: 'Assessment of development workflows and processes',
    questions: [
      {
        text: 'How effective is the current CI/CD pipeline?',
        type: 'RADIO',
        options: ['Very Effective', 'Effective', 'Neutral', 'Ineffective', 'Very Ineffective'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'DEVOPS_ENGINEER'],
        order: 1
      },
      {
        text: 'Which agile practices does your team follow?',
        type: 'CHECKBOX',
        options: [
          'Daily standups',
          'Sprint planning',
          'Retrospectives',
          'User story mapping',
          'Continuous integration',
          'Test-driven development'
        ],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'PROJECT_MANAGER'],
        order: 2
      },
      {
        text: 'Rate your team\'s delivery velocity (1-10)',
        type: 'SCALE',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'PROJECT_MANAGER'],
        order: 3
      },
      {
        text: 'What process improvements would you recommend?',
        type: 'TEXT',
        required: false,
        targetRoles: ['DEVELOPER', 'LEAD_DEVELOPER', 'PROJECT_MANAGER'],
        order: 4
      }
    ]
  }
];

export const PROJECTS = [
  'Portfolio Frontend',
  'Portfolio Backend',
  'System Designer',
  'YouTube Integration',
  'Social Media Module',
  'Audit Survey System'
];

export const USER_ROLES = [
  'DEVELOPER',
  'LEAD_DEVELOPER',
  'SECURITY_ENGINEER',
  'DEVOPS_ENGINEER',
  'PROJECT_MANAGER',
  'ADMIN'
];
