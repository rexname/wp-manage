
export type LlmProviderId = 'google' | 'openai' | 'openrouter' | 'ollama' | 'custom';

export interface LlmProvider {
  id: LlmProviderId;
  name: string;
  icon: string; // SVG path data
}
