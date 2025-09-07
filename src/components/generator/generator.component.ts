
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { WordpressService } from '../../services/wordpress.service';
import { NotificationService } from '../../services/notification.service';
import { GeneratedArticle } from '../../models/article.model';
import { LlmProvider, LlmProviderId } from '../../models/llm.model';

@Component({
  selector: 'app-generator',
  template: `
<div class="space-y-8">
  <header>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Article Generator</h1>
    <p class="mt-2 text-gray-500 dark:text-gray-400">Create high-quality, SEO-optimized content in seconds.</p>
  </header>

  <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <form (submit)="generateArticles($event)" class="space-y-6">
      <div>
        <label for="topic" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Article Topic</label>
        <input type="text" name="topic" id="topic" required class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3" placeholder="e.g., 'The Future of Renewable Energy'">
      </div>

      <div>
        <label for="website" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Target Website</label>
        <select name="website" id="website" required class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3">
          <option value="" disabled selected>Select a website...</option>
          @for(site of connectedWebsites(); track site.id) {
            <option [value]="site.id">{{ site.name }} (Topic: {{ site.topic }})</option>
          }
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">AI Provider</label>
        <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          @for(provider of llmProviders(); track provider.id) {
            <button type="button" (click)="selectedProvider.set(provider.id)" 
                    [class]="'p-3 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all ' + (selectedProvider() === provider.id ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500' : 'bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [class]="selectedProvider() === provider.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" [attr.d]="provider.icon" /></svg>
              <span class="text-sm font-medium" [class]="selectedProvider() === provider.id ? 'text-indigo-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'">{{ provider.name }}</span>
            </button>
          }
        </div>
      </div>
      
      <button type="submit" [disabled]="isLoading()" class="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed text-lg h-12">
        @if (isLoading()) {
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>Generating Article...</span>
        } @else {
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          <span>Generate Article</span>
        }
      </button>
    </form>
  </section>

  @if (generatedArticles().length > 0) {
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Generated Content</h2>
      @for(article of generatedArticles(); track article.id) {
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <header class="p-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ article.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">For: {{ article.targetWebsiteName }}</p>
            </div>
            <div class="flex items-center space-x-4">
                <div class="text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">SEO Score</p>
                    <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ article.seoScore }}</p>
                </div>
                @if (article.status === 'draft' || article.status === 'error') {
                    <button (click)="publishArticle(article.id)" class="bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span>Publish</span>
                    </button>
                } @else if(article.status === 'publishing') {
                     <button disabled class="bg-gray-400 dark:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 cursor-not-allowed">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Publishing...</span>
                    </button>
                } @else if(article.status === 'published') {
                    <div class="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                         <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <span>Published</span>
                    </div>
                }
            </div>
          </header>
          <div class="p-4 prose prose-invert max-w-none text-gray-600 dark:text-gray-300 max-h-64 overflow-y-auto prose-h1:text-gray-900 dark:prose-h1:text-white prose-h2:text-gray-800 dark:prose-h2:text-gray-200" [innerHTML]="article.content"></div>
        </div>
      }
    </section>
  }
</div>
  `,
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