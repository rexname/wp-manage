
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { WordpressService } from '../../services/wordpress.service';
import { NotificationService } from '../../services/notification.service';
import { GeneratedArticle } from '../../models/article.model';
import { LlmProvider, LlmProviderId } from '../../models/llm.model';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class GeneratorComponent {
  private llmService = inject(LlmService);
  private wordpressService = inject(WordpressService);
  private notificationService = inject(NotificationService);

  websites = this.wordpressService.websites;
  isLoading = signal(false);
  generatedArticles = signal<GeneratedArticle[]>([]);
  
  llmProviders = signal<LlmProvider[]>([
    { id: 'google', name: 'Google Gemini', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'},
    { id: 'openai', name: 'OpenAI', icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1 -4 10a15.3 15.3 0 0 1 -4 -10a15.3 15.3 0 0 1 4 -10z' },
    { id: 'openrouter', name: 'OpenRouter', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
    { id: 'ollama', name: 'Ollama', icon: 'M12 20.94c-4.97-4.97-4.97-13.03 0-18 .5-.5 1.02-.98 1.56-1.44H9c-4.97 0-9 4.03-9 9s4.03 9 9 9h4.56c-.46-.54-.94-1.06-1.44-1.56z' },
  ]);
  
  selectedProvider = signal<LlmProviderId>('google');

  connectedWebsites = computed(() => this.websites().filter(w => w.status === 'connected'));

  async generateArticles(event: Event) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const topic = formData.get('topic') as string;
    const websiteId = formData.get('website') as string;

    event.preventDefault();

    if (!topic || !websiteId) {
      this.notificationService.error('Please provide a topic and select a website.');
      return;
    }

    this.isLoading.set(true);
    this.generatedArticles.set([]);
    
    try {
      const content = await this.llmService.generateArticle(topic, this.selectedProvider());
      const website = this.websites().find(w => w.id === websiteId);
      
      const newArticle: GeneratedArticle = {
        id: Date.now().toString(),
        title: this.extractTitle(content) || `Article about ${topic}`,
        content: content,
        seoScore: Math.floor(Math.random() * 21) + 80, // 80-100
        status: 'draft',
        targetWebsiteId: websiteId,
        targetWebsiteName: website?.name || 'Unknown Website'
      };
      
      this.generatedArticles.set([newArticle]);
      this.notificationService.success('Article generated successfully!');

    } catch (e: any) {
      this.notificationService.error(e.message || 'An unknown error occurred during generation.');
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private extractTitle(htmlContent: string): string {
    const match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return match ? match[1] : '';
  }

  publishArticle(articleId: string) {
    const article = this.generatedArticles().find(a => a.id === articleId);
    if (!article) return;

    this.generatedArticles.update(articles => 
        articles.map(a => a.id === articleId ? { ...a, status: 'publishing' } : a)
    );
    
    // Simulate API call
    setTimeout(() => {
      const publishSuccess = Math.random() > 0.1; // 90% success rate
      if (publishSuccess) {
          this.generatedArticles.update(articles => 
              articles.map(a => a.id === articleId ? { ...a, status: 'published' } : a)
          );
          this.wordpressService.publishArticle(article.targetWebsiteId);
          this.notificationService.success(`Article published to ${article.targetWebsiteName}!`);
      } else {
          this.generatedArticles.update(articles => 
              articles.map(a => a.id === articleId ? { ...a, status: 'error' } : a)
          );
          this.notificationService.error(`Failed to publish article to ${article.targetWebsiteName}.`);
      }
    }, 2000);
  }
}
