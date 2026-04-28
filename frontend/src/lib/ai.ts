/**
 * Gemini AI client for HackOps.
 * Runs entirely client-side — API key stored in localStorage only.
 */

import { getAISettings } from './storage';

/* ─── Types ─────────────────────────────────────────────────── */

export interface AIMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AIResponse {
  text: string;
  model: string;
  tokensUsed?: number;
}

/* ─── Models ────────────────────────────────────────────────── */

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const;

export type AIModel = (typeof MODELS)[number];

export const AVAILABLE_MODELS: { id: AIModel; name: string; description: string }[] = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Fast, efficient — best for hints & quick analysis' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Balanced speed & quality' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable — best for deep threat analysis' },
];

/* ─── API Call ───────────────────────────────────────────────── */

async function callGemini(
  prompt: string,
  options: {
    model?: AIModel;
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
    history?: AIMessage[];
  } = {}
): Promise<AIResponse> {
  const settings = getAISettings();

  if (!settings.apiKey) {
    throw new Error('AI_NOT_CONFIGURED');
  }

  const model = options.model || (settings.model as AIModel) || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.apiKey}`;

  const contents: AIMessage[] = [
    ...(options.history || []),
    { role: 'user', parts: [{ text: prompt }] },
  ];

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
      topP: 0.95,
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  // Try primary model, fall back to alternatives
  const modelsToTry = [model, ...MODELS.filter((m) => m !== model)];

  for (const tryModel of modelsToTry) {
    try {
      const tryUrl = `https://generativelanguage.googleapis.com/v1beta/models/${tryModel}:generateContent?key=${settings.apiKey}`;

      const response = await fetch(tryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 429 || response.status === 503) {
        // Rate limited or overloaded — try next model
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = (errorData as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('Empty response from AI');
      }

      return {
        text,
        model: tryModel,
        tokensUsed: data?.usageMetadata?.totalTokenCount,
      };
    } catch (error) {
      if (tryModel === modelsToTry[modelsToTry.length - 1]) {
        throw error; // Last model — rethrow
      }
      // Try next model
    }
  }

  throw new Error('All AI models failed');
}

/* ─── Public AI Functions ────────────────────────────────────── */

const SECURITY_SYSTEM_PROMPT = `You are HackOps AI — an expert cybersecurity educator integrated into an interactive security training platform. You teach through explanation, not just answers. Be concise, technical but accessible, and always explain the "why" behind security concepts. Use markdown formatting for readability. Never provide actual exploit code for real systems — this is an educational sandbox only.`;

/**
 * AI Security Advisor — analyzes a user's challenge attempt and provides
 * educational feedback about the security concepts involved.
 */
export async function analyzeAttempt(params: {
  challengeType: string;
  level: number;
  userInput: string;
  wasSuccessful: boolean;
  context?: string;
}): Promise<AIResponse> {
  const prompt = `## Challenge Analysis Request
**Challenge**: ${params.challengeType} (Level ${params.level})
**User's Input**: \`${params.userInput}\`
**Result**: ${params.wasSuccessful ? '✅ Successful' : '❌ Failed'}
${params.context ? `**Context**: ${params.context}` : ''}

Provide a brief security analysis:
1. **What happened**: Explain what the user's input did (or why it failed)
2. **Security concept**: What real-world security principle does this demonstrate?
3. **Defense**: How would a developer protect against this in production?
4. **Next step**: One sentence suggesting what to try next

Keep it under 200 words. Be encouraging.`;

  return callGemini(prompt, {
    systemInstruction: SECURITY_SYSTEM_PROMPT,
    temperature: 0.6,
    maxTokens: 512,
  });
}

/**
 * AI Hint Engine — generates contextual, progressive hints.
 */
export async function generateHint(params: {
  challengeType: string;
  level: number;
  attemptCount: number;
  previousAttempts?: string[];
}): Promise<AIResponse> {
  const hintLevel = Math.min(params.attemptCount, 3);
  const progressiveness = ['vague and conceptual', 'moderately specific', 'very specific, nearly giving the answer'][hintLevel - 1] || 'moderately specific';

  const prompt = `## Hint Request
**Challenge**: ${params.challengeType} (Level ${params.level})
**Attempts so far**: ${params.attemptCount}
${params.previousAttempts?.length ? `**Previous attempts**: ${params.previousAttempts.slice(-3).join(', ')}` : ''}

Generate a single hint that is **${progressiveness}**.

The hint should:
- Teach a real security concept
- Guide without giving the exact answer (unless attempt count > 5)
- Be 1-2 sentences maximum
- Include a relevant emoji

Format: Just the hint text, nothing else.`;

  return callGemini(prompt, {
    systemInstruction: SECURITY_SYSTEM_PROMPT,
    temperature: 0.8,
    maxTokens: 150,
  });
}

/**
 * AI Threat Analyzer — analyzes code/text for security vulnerabilities.
 */
export async function analyzeThreat(params: {
  input: string;
  type: 'code' | 'url' | 'log' | 'general';
}): Promise<AIResponse> {
  const prompt = `## Security Threat Analysis
**Input type**: ${params.type}
**Content to analyze**:
\`\`\`
${params.input.slice(0, 3000)}
\`\`\`

Perform a comprehensive security analysis:

### 🔍 Vulnerability Assessment
For each vulnerability found, provide:
- **Type**: (e.g., XSS, SQLi, CSRF, Insecure Auth, etc.)
- **Severity**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
- **Location**: Where in the code/input
- **Explanation**: What the vulnerability is and how it could be exploited
- **Fix**: Specific remediation code or steps

### 📊 Overall Risk Score
Rate the overall security from 1-10 (10 = most secure)

### ✅ What's Done Well
Mention any good security practices found

### 🛡️ Recommendations
Top 3 priority security improvements

Be thorough but concise. Use markdown formatting.`;

  return callGemini(prompt, {
    systemInstruction: SECURITY_SYSTEM_PROMPT,
    temperature: 0.4,
    maxTokens: 2048,
  });
}

/**
 * AI Password Analyzer — evaluates password strength with real attack context.
 */
export async function analyzePassword(password: string): Promise<AIResponse> {
  // Don't send actual password to API — analyze locally and send pattern
  const pattern = password
    .replace(/[a-z]/g, 'a')
    .replace(/[A-Z]/g, 'A')
    .replace(/[0-9]/g, '0')
    .replace(/[^aA0]/g, '!');

  const stats = {
    length: password.length,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    pattern,
    uniqueChars: new Set(password).size,
    isCommonPattern: /^(password|123456|qwerty|admin|letmein)/i.test(password),
  };

  const prompt = `## Password Strength Analysis
**Pattern**: \`${stats.pattern}\` (actual password NOT shown for security)
**Length**: ${stats.length} characters
**Uppercase**: ${stats.hasUpper ? 'Yes' : 'No'}
**Lowercase**: ${stats.hasLower ? 'Yes' : 'No'}
**Digits**: ${stats.hasDigit ? 'Yes' : 'No'}
**Special chars**: ${stats.hasSpecial ? 'Yes' : 'No'}
**Unique chars**: ${stats.uniqueChars}
**Common pattern**: ${stats.isCommonPattern ? '⚠️ YES' : 'No'}

Analyze this password's security:

1. **Strength Rating**: 🔴 Very Weak | 🟠 Weak | 🟡 Fair | 🟢 Strong | 💎 Excellent
2. **Attack Vectors**: Which attacks would crack this? (brute force, dictionary, rainbow table, social engineering)
3. **Estimated Crack Time**: How long would common tools take?
4. **Specific Weaknesses**: What makes this vulnerable?
5. **Improvements**: 3 specific changes to make it stronger

Be concise — under 250 words.`;

  return callGemini(prompt, {
    systemInstruction: SECURITY_SYSTEM_PROMPT,
    temperature: 0.5,
    maxTokens: 512,
  });
}

/**
 * AI Security Quiz — generates custom quiz questions.
 */
export async function generateQuiz(params: {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count?: number;
}): Promise<AIResponse> {
  const prompt = `Generate ${params.count || 3} multiple-choice cybersecurity quiz questions.

**Topic**: ${params.topic}
**Difficulty**: ${params.difficulty}

Format each question exactly like this:
---
**Q1**: [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
**Answer**: [Letter]
**Explanation**: [Brief explanation of why]
---

Questions should test practical knowledge, not just definitions. Include real-world scenarios.`;

  return callGemini(prompt, {
    systemInstruction: SECURITY_SYSTEM_PROMPT,
    temperature: 0.9,
    maxTokens: 1500,
  });
}

/**
 * Check if AI is properly configured and working.
 */
export async function testAIConnection(): Promise<{ success: boolean; model: string; error?: string }> {
  try {
    const result = await callGemini('Respond with exactly: "HackOps AI connected" and nothing else.', {
      maxTokens: 20,
      temperature: 0,
    });
    return { success: true, model: result.model };
  } catch (error) {
    return {
      success: false,
      model: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
