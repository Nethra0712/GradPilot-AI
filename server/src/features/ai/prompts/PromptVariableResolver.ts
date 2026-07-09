import { AIContext } from '../context/context.types';

/**
 * PromptVariableResolver
 *
 * Extracts and formats variables from the AIContext and custom inputs.
 * Normalizes values, applies defaults, and formats list arrays into clean strings.
 */
export class PromptVariableResolver {
  /**
   * Resolves and normalizes prompt variables from context and inputs.
   */
  public resolve(
    context?: AIContext,
    customVars?: Record<string, unknown>
  ): Record<string, string> {
    const resolved: Record<string, string> = {};

    // 1. Map personal/student context
    if (context?.student) {
      resolved.fullName = context.student.fullName || 'Applicant';
      resolved.nationality = context.student.nationality || 'Not specified';
      resolved.dob = context.student.dob || 'Not specified';
      resolved.currentEducation = context.student.currentEducation || 'Not specified';
      resolved.institution = context.student.institution || 'Not specified';
      resolved.graduationYear = context.student.graduationYear
        ? String(context.student.graduationYear)
        : 'Not specified';
      resolved.gpa = context.student.gpa || 'Not specified';
    } else {
      resolved.fullName = 'Applicant';
      resolved.nationality = 'Not specified';
      resolved.dob = 'Not specified';
      resolved.currentEducation = 'Not specified';
      resolved.institution = 'Not specified';
      resolved.graduationYear = 'Not specified';
      resolved.gpa = 'Not specified';
    }

    // 2. Map target studies
    if (context?.targetStudy) {
      resolved.targetDegree = context.targetStudy.degree || 'Not specified';
      resolved.targetField = context.targetStudy.fieldOfStudy || 'Not specified';
      resolved.targetUniversities = Array.isArray(context.targetStudy.universities)
        ? context.targetStudy.universities.join(', ')
        : 'Not specified';
    } else {
      resolved.targetDegree = 'Not specified';
      resolved.targetField = 'Not specified';
      resolved.targetUniversities = 'Not specified';
    }

    // 3. Map career goals
    if (context?.career) {
      resolved.careerGoals = context.career.goals || 'Not specified';
      resolved.dreamJob = context.career.dreamJob || 'Not specified';
    } else {
      resolved.careerGoals = 'Not specified';
      resolved.dreamJob = 'Not specified';
    }

    // 4. Serialize work experience arrays to Markdown lists
    if (context?.experience?.workExperience && context.experience.workExperience.length > 0) {
      resolved.workExperienceMarkdown = context.experience.workExperience
        .map(
          (work) =>
            `- **${work.jobTitle}** at *${work.company}* (${work.startDate || ''} - ${work.endDate || 'Present'})\n  ${work.description || ''}`
        )
        .join('\n');
    } else {
      resolved.workExperienceMarkdown = 'No work experience listed.';
    }

    // 5. Serialize academic projects
    if (context?.experience?.projects && context.experience.projects.length > 0) {
      resolved.projectsMarkdown = context.experience.projects
        .map(
          (proj) =>
            `- **${proj.title}** (${proj.role || 'Developer'})\n  ${proj.description || ''}${proj.link ? `\n  Link: ${proj.link}` : ''}`
        )
        .join('\n');
    } else {
      resolved.projectsMarkdown = 'No projects listed.';
    }

    // 6. Serialize awards
    if (context?.experience?.awards && context.experience.awards.length > 0) {
      resolved.awardsMarkdown = context.experience.awards
        .map(
          (aw) =>
            `- **${aw.title}** issued by *${aw.issuer || 'N/A'}* (${aw.year || ''})\n  ${aw.description || ''}`
        )
        .join('\n');
    } else {
      resolved.awardsMarkdown = 'No awards listed.';
    }

    // 7. Serialize skills
    if (context?.skills?.technicalSkills && context.skills.technicalSkills.length > 0) {
      resolved.skillsList = context.skills.technicalSkills
        .map((sk) => `${sk.name} (${sk.level || 'Intermediate'})`)
        .join(', ');
    } else {
      resolved.skillsList = 'No technical skills listed.';
    }

    // 8. Serialize languages
    if (context?.skills?.languages && context.skills.languages.length > 0) {
      resolved.languagesList = context.skills.languages
        .map((lang) => `${lang.language} (${lang.level})`)
        .join(', ');
    } else {
      resolved.languagesList = 'No foreign languages listed.';
    }

    // 9. Serialize test scores
    if (context?.skills?.englishTests && context.skills.englishTests.length > 0) {
      resolved.englishTestsList = context.skills.englishTests
        .map((test) => `${test.testType} score: ${test.score} (${test.dateTaken || ''})`)
        .join(', ');
    } else {
      resolved.englishTestsList = 'No standardized English test scores listed.';
    }

    // 10. Merge custom dynamic request variables (override defaults)
    if (customVars) {
      Object.keys(customVars).forEach((key) => {
        if (customVars[key] !== undefined && customVars[key] !== null) {
          resolved[key] = String(customVars[key]);
        }
      });
    }

    return resolved;
  }
}
