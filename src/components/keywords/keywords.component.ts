
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { WordpressService } from '../../services/wordpress.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class KeywordsComponent {
  private llmService = inject(LlmService);
  private notificationService = inject(NotificationService);
  wordpressService = inject(WordpressService);

  isLoading = signal(false);
  keywords = signal<string[]>([]);
  
  mockTrends = signal([
    { keyword: 'AI in content creation', volume: 'High', trend: 'up' },
    { keyword: 'sustainable living tips', volume: 'Medium', trend: 'up' },
    { keyword: 'latest javascript frameworks', volume: 'High', trend: 'down' },
    { keyword: 'home cooking recipes 2024', volume: 'Medium', trend: 'stable' },
  ]);

  async searchKeywords(event: Event) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const topic = formData.get('topic') as string;

    event.preventDefault();

    if (!topic) {
      this.notificationService.error('Please enter a topic to search for keywords.');
      return;
    }

    this.isLoading.set(true);
    this.keywords.set([]);

    try {
      const result = await this.llmService.generateKeywords(topic);
      this.keywords.set(result);
    } catch (e: any) {
      this.notificationService.error(e.message || 'An unknown error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.notificationService.success(`Copied "${text}" to clipboard!`);
  }
}
