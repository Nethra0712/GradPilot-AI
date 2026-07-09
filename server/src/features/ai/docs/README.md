# AI Engine Foundation Architecture

This directory outlines the reusable, provider-independent AI Engine infrastructure designed to support text completions and future streams.

## 🏗️ Architectural Layout

The layout decouples prompt formatting and adapter selections from LLM APIs:

```
               [ Client HTTP POST /ai/test ]
                             │
                             ▼
 ╔═══════════════════════════════════════════════════════════╗
 ║ AIEngine (Pipeline Execution)                             ║
 ║                                                           ║
 ║ 1. Init Correlation Request ID (UUID)                     ║
 ║ 2. Fetch User Profile & compile AIContext                 ║
 ║ 3. Resolve Prompt Variables (PromptVariableResolver)      ║
 ║ 4. Interpolate Variables (PromptRenderer)                 ║
 ║ 5. Check Token Safety Budgets (tokenEstimator)           ║
 ║ 6. Instantiate Provider (ProviderRegistry)                ║
 ║ 7. Execute Call with Latency metrics                      ║
 ║ 8. Record Usage audits in database (AIGeneration table)   ║
 ║ 9. Format response payload                                ║
 ╚═══════════════════════════════════════════════════════════╝
                             │
                             ├───────────────────────┐
                             ▼                       ▼
                    [ Mock OpenAI ]          [ Mock Claude ]
```

---

## 🔌 Provider Registry & Decoupled Adapters

`ProviderRegistry` dynamically registers provider classes (`OpenAIProvider`, `ClaudeProvider`, `GeminiProvider`). Rather than hardcoding provider branches:

1.  New adapters inherit from `AIProvider` and register via `providerRegistry.registerProvider(instance)`.
2.  `AIProviderFactory` looks up registry keys dynamically based on active configuration keys (`AI_PROVIDER` default) or request overrides.
3.  This makes it easy to integrate models like DeepSeek, Mistral, or Grok in the future without modifying existing business logic.

---

## 📝 Prompt Variable Resolver & Renderer

Prompt compilation is split into two phases:

- **PromptVariableResolver**: Extracts data from `AIContext` (personal details, education) and constructs structured variables. List fields (like work experiences or projects) are serialized into formatted Markdown lists.
- **PromptRenderer**: Scans template strings and interpolates placeholders matching `{{variable}}`. It validates that all required parameters declared in the template metadata are successfully resolved, throwing a validation error if any are missing.

---

## 📈 Token Estimation Strategy

The utility `tokenEstimator.ts` calculates prompt, completion, and total tokens based on character length heuristics (approximately 4 characters per token). This operates locally, validating size boundaries before spending API credits, and logs counts for auditing.

---

## 🛡️ Error Safety & Request Correlation

Every AI execution generates a unique `requestId` (UUID). If an execution fails (e.g. `TokenLimitError`, `ProviderUnavailableError`), the `AIError` catches the request ID and returns a unified JSON format:

```json
{
  "status": "error",
  "code": "TOKEN_LIMIT_EXCEEDED",
  "message": "Estimated tokens exceed safety limits.",
  "requestId": "correlation-uuid-value",
  "details": {}
}
```

This simplifies log analysis and debugging in production.

---

## 📑 How Future Document Generators Will Integrate

To create features like an SOP Generator, a CV Writer, or a Letter Builder in future sprints:

1.  **Define Templates**: Create structured files inside `promptTemplates/` declaring the required inputs (e.g. `programName`, `academicInterests`) and system instructions.
2.  **Mount Endpoints**: Bind user parameters in dedicated routes (e.g., `POST /api/documents/sop`).
3.  **Invoke Engine**: The document controller fetches the user's profile, compiles variables, and calls `aiEngine.generate(userId, { template, variables })` to retrieve the completed draft cleanly.
