# Prompt Templates Directory

This directory holds instruction guides and structured text blueprints for application documents (SOPs, Personal Statements, CVs).

## Reusable Context Injection Flow

Every AI prompt generator in the future should follow this structured sequence:

1.  **Retrieve Profile**: Query the active user's profile and user metadata.
2.  **Generate Context**: Invoke the pure `buildAIContext(profile, user)` utility to extract a normalized `AIContext` record.
3.  **Serialize Context**: Convert `AIContext` into a clean Markdown block to append into LLM message sets.
4.  **Append Instructions**: Merge program details and template instructions from prompt modules.
5.  **Send Request**: Invoke the respective AI adapter.

```
       [ Database Profile ]
               │
               ▼
   buildAIContext(profile, user)
               │
               ▼
        [ AIContext ]
               │
               ▼  (Serialized to Markdown)
 ╔═════════════════════════════════╗
 ║ ### Applicant Metadata          ║
 ║ Name: Jane Doe                  ║
 ║ Target Degree: Master in AI     ║
 ║ GPA: 3.84/4.0                   ║
 ║ ...                             ║
 ╚═════════════════════════════════╝
               │
               ▼
     [ System Prompt Template ]
               │
               ▼
    [ OpenAI / Anthropic API ]
```

## Adding Prompt Blueprints

When adding new prompt layouts in future sprints:

- Place the template configurations inside this folder (e.g. `sopPrompt.ts`, `cvPrompt.ts`).
- Maintain a decoupling from LLM API payloads; templates should return static arrays of system/user messages.
