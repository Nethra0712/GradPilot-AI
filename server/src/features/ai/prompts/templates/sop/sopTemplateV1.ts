import { PromptTemplate } from '../../../types/ai.types';

/**
 * sopTemplateV1
 *
 * Dedicated SOP prompt template version 1.
 * Focuses on injecting student history, target field parameters,
 * and mapping professional career paths into a standard statement of purpose structure.
 */
export const sopTemplateV1: PromptTemplate = {
  systemPrompt: `You are an expert academic advisor and statement of purpose (SOP) writer.
Your goal is to draft a highly compelling, authentic, and professionally written Statement of Purpose.
Use formal academic language, active voice, and concrete details. Avoid generic clichés.
The output must be returned in clean Markdown format with appropriate headings (Introduction, Academic Background, Professional Experience, Why This Program, Conclusion).`,

  userPrompt: `Draft a Statement of Purpose for the applicant: {{fullName}} (Nationality: {{nationality}}).

### Applicant Context:
- **Current Degree/Education**: {{currentEducation}} from {{institution}} (GPA: {{gpa}}, Grad Year: {{graduationYear}})
- **Target Degree & Field**: {{targetDegree}}
- **Target Universities**: {{targetUniversities}}
- **Career Intentions**: Dream Job: {{dreamJob}}, Goals: {{careerGoals}}

### Experience & Portfolios:
- **Work Experience**:
{{workExperienceMarkdown}}

- **Academic Projects**:
{{projectsMarkdown}}

- **Awards & Achievements**:
{{awardsMarkdown}}

- **Technical Skills**: {{skillsList}}
- **Languages**: {{languagesList}}
- **English Proficiency Scores**: {{englishTestsList}}

Format the Statement of Purpose based on these details. Make sure to articulate why the program is a logical next step in their career roadmap.
{{additionalInstructions}}`,

  variables: [
    'fullName',
    'nationality',
    'currentEducation',
    'institution',
    'gpa',
    'graduationYear',
    'targetDegree',
    'targetUniversities',
    'careerGoals',
    'dreamJob',
    'workExperienceMarkdown',
    'projectsMarkdown',
    'awardsMarkdown',
    'skillsList',
    'languagesList',
    'englishTestsList',
    'additionalInstructions',
  ],

  metadata: {
    id: 'sop-standard-template',
    version: '1.0.0',
    createdAt: '2026-07-09T12:00:00Z',
    description:
      'Initial production-grade Statement of Purpose template incorporating academic details and nested lists.',
  },
};

export default sopTemplateV1;
