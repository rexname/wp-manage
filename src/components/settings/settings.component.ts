
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { NotificationService } from '../../services/notification.service';
import { LlmProviderId } from '../../models/llm.model';

@Component({
  selector: 'app-settings',
  template: `
<div class="space-y-8 max-w-4xl mx-auto">
  <header>
    <h1 class="text-3xl font-bold text-white">Settings</h1>
    <p class="mt-2 text-gray-400">Configure your API keys and application preferences.</p>
  </header>

  <form (submit)="saveSettings($event)">
    <div class="bg-gray-800 rounded-lg shadow-lg">
      <div class="p-6 space-y-6">
        <h2 class="text-xl font-semibold text-white">LLM API Keys</h2>
        @for(provider of providers; track provider.id) {
          <div>
            <label [for]="provider.id" class="block text-sm font-medium text-gray-300">{{ provider.name }}</label>
            @if(provider.id === 'google') {
               <input type="text" [id]="provider.id" [name]="provider.id" disabled [value]="apiKeys()[provider.id]"
                   class="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm sm:text-sm text-gray-400 cursor-not-allowed">
                <p class="mt-2 text-xs text-gray-500">The Google Gemini API key is securely managed via the 'API_KEY' environment variable and cannot be changed here.</p>
            } @else {
               <input type="password" [id]="provider.id" [name]="provider.id" [value]="apiKeys()[provider.id]"
                   class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" 
                   [placeholder]="'Enter your ' + provider.name">
            }
          </div>
        }
      </div>
      <div class="px-6 py-4 bg-gray-700/50 text-right rounded-b-lg">
        <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
          Save Settings
        </button>
      </div>
    </div>
  </form>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SettingsComponent {
  private llmService = inject(LlmService);
  private notificationService = inject(NotificationService);

  apiKeys = this.llmService.apiKeys;

  providers: {id: LlmProviderId, name: string}[] = [
    { id: 'google', name: 'Google Gemini API Key'},
    { id: 'openai', name: 'OpenAI API Key'},
    { id: 'openrouter', name: 'OpenRouter API Key'},
    { id: 'ollama', name: 'Ollama Base URL'},
  ];

  saveSettings(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    this.providers.forEach(provider => {
        if (provider.id !== 'google') {
            const input = form.elements.namedItem(provider.id) as HTMLInputElement;
            this.llmService.updateApiKey(provider.id, input.value);
        }
    });

    this.notificationService.success('Settings saved successfully!');
  }
}