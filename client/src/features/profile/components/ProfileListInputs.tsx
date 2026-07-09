import React from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { StudentProfile } from '../types/profile.types';

interface ListInputProps {
  control: Control<StudentProfile>;
  register: UseFormRegister<StudentProfile>;
  errors?: FieldErrors<StudentProfile>;
}

// ─── 1. TARGET UNIVERSITIES ───────────────────────────────────────────────────

export const TargetUniversitiesInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'targetUniversities' as never,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Target Universities
        </label>
        <button
          type="button"
          onClick={() => append('' as never)}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
        >
          + Add University
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No universities added yet.</p>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`targetUniversities.${index}` as const, { required: true })}
                className="flex-1 h-10 bg-slate-950 border border-slate-900 rounded-xl text-sm px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="e.g. Stanford University"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label="Remove university"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 2. WORK EXPERIENCE ────────────────────────────────────────────────────────

export const ExperienceListInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperience',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Work Experience
        </label>
        <button
          type="button"
          onClick={() =>
            append({ jobTitle: '', company: '', startDate: '', endDate: '', description: '' })
          }
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Position
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No professional experience listed.</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-slate-900/50 bg-slate-950/20 rounded-xl relative space-y-3"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label="Remove position"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Role / Job Title
                  </label>
                  <input
                    {...register(`workExperience.${index}.jobTitle` as const, { required: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Software Engineer Intern"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Company / Organization
                  </label>
                  <input
                    {...register(`workExperience.${index}.company` as const, { required: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    {...register(`workExperience.${index}.startDate` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. June 2024"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    End Date
                  </label>
                  <input
                    {...register(`workExperience.${index}.endDate` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. August 2024 (or Present)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                  Responsibilities & Impact
                </label>
                <textarea
                  {...register(`workExperience.${index}.description` as const)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-900 rounded-lg text-xs p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  placeholder="Summarize key tasks, tech stack, and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 3. PROJECTS ──────────────────────────────────────────────────────────────

export const ProjectListInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Projects
        </label>
        <button
          type="button"
          onClick={() => append({ title: '', role: '', description: '', link: '' })}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No academic or personal projects listed.</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-slate-900/50 bg-slate-950/20 rounded-xl relative space-y-3"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label="Remove project"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Project Name
                  </label>
                  <input
                    {...register(`projects.${index}.title` as const, { required: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Distributed Database Engine"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Your Role
                  </label>
                  <input
                    {...register(`projects.${index}.role` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Lead Core Developer"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Link URL (optional)
                  </label>
                  <input
                    {...register(`projects.${index}.link` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. https://github.com/username/project"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                  Description & Impact
                </label>
                <textarea
                  {...register(`projects.${index}.description` as const)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-900 rounded-lg text-xs p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  placeholder="Scope, languages, and technical difficulties solved..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 4. AWARDS & ACHIEVEMENTS ──────────────────────────────────────────────────

export const AwardListInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'awards',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Awards & Honors
        </label>
        <button
          type="button"
          onClick={() => append({ title: '', issuer: '', year: null, description: '' })}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Award
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No awards or honors listed.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-slate-900/50 bg-slate-950/20 rounded-xl relative space-y-3"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label="Remove award"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Award Title
                  </label>
                  <input
                    {...register(`awards.${index}.title` as const, { required: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Dean honored list"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    {...register(`awards.${index}.year` as const, { valueAsNumber: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                  Awarding Body / Issuer
                </label>
                <input
                  {...register(`awards.${index}.issuer` as const)}
                  className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. College of Engineering Dean Office"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 5. SKILLS ─────────────────────────────────────────────────────────────────

export const SkillListInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Technical Skills
        </label>
        <button
          type="button"
          onClick={() => append({ name: '', level: 'Intermediate' })}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No skills listed yet.</p>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`skills.${index}.name` as const, { required: true })}
                className="flex-1 h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="e.g. Python, Docker, PyTorch"
              />
              <select
                {...register(`skills.${index}.level` as const)}
                className="h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                aria-label="Remove skill"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 6. LANGUAGES ──────────────────────────────────────────────────────────────

export const LanguageListInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Languages Spoken
        </label>
        <button
          type="button"
          onClick={() => append({ language: '', level: 'Intermediate' })}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Language
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No languages listed yet.</p>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`languages.${index}.language` as const, { required: true })}
                className="flex-1 h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="e.g. German, French"
              />
              <select
                {...register(`languages.${index}.level` as const)}
                className="h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native/Bilingual">Native/Bilingual</option>
              </select>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                aria-label="Remove language"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── 7. ENGLISH TESTS ───────────────────────────────────────────────────────────

export const EnglishTestsInput: React.FC<ListInputProps> = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'englishTests',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Standardized English Tests
        </label>
        <button
          type="button"
          onClick={() => append({ testType: 'IELTS', score: '', dateTaken: '' })}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          + Add Test Score
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-600 italic">No English scores listed.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-slate-900/50 bg-slate-950/20 rounded-xl relative space-y-3"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                aria-label="Remove score record"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Test Type
                  </label>
                  <select
                    {...register(`englishTests.${index}.testType` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="PTE">PTE</option>
                    <option value="Duolingo">Duolingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Band Score / Total
                  </label>
                  <input
                    {...register(`englishTests.${index}.score` as const, { required: true })}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. Band 8.0, 115"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium uppercase mb-1">
                    Date Taken
                  </label>
                  <input
                    {...register(`englishTests.${index}.dateTaken` as const)}
                    className="w-full h-9 bg-slate-950 border border-slate-900 rounded-lg text-xs px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. October 2024"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
