
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { NotificationService } from '../../services/notification.service';
import { LlmProviderId } from '../../models/llm.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
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
