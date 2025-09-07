
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LlmService } from '../../services/llm.service';
import { WordpressService } from '../../services/wordpress.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-keywords',
  template: `
<div class="space-y-8">
  <header>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Keyword Research</h1>
    <p class="mt-2 text-gray-500 dark:text-gray-400">Discover trending topics and generate relevant keywords for your content.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-1 space-y-6">
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Google Trends</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Simulated trending keywords.</p>
        <ul class="mt-4 space-y-3">
          @for(trend of mockTrends(); track trend.keyword) {
            <li class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">{{ trend.keyword }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-mono px-2 py-1 rounded" [class]="{
                  'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400': trend.volume === 'High',
                  'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400': trend.volume === 'Medium'
                }">{{ trend.volume }}</span>
                @if(trend.trend === 'up') {
                  <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                } @else if (trend.trend === 'down') {
                  <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17l5-5m0 0l-5-5m5 5H6" /></svg>
                } @else {
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
                }
              </div>
            </li>
          }
        </ul>
      </section>
    </div>

    <div class="lg:col-span-2 space-y-6">
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Generate Keywords</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Use AI to find long-tail keywords for any topic.</p>
        <form (submit)="searchKeywords($event)" class="mt-4 space-y-4">
          <div>
            <label for="topic" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Topic or Main Keyword</label>
            <input type="text" name="topic" id="topic" required class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3" placeholder="e.g., 'Beginner's guide to Angular'">
          </div>
          
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label for="search_engine" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Search Engine</label>
                <select id="search_engine" name="search_engine" class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3">
                  <option>Google</option>
                  <option>Bing</option>
                  <option>DuckDuckGo</option>
                </select>
            </div>
            <div>
                <label for="country" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Country</label>
                <select id="country" name="country" class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
            </div>
             <div>
                <label for="language" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Language</label>
                <select id="language" name="language" class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>German</option>
                </select>
            </div>
             <div>
                <label for="location" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Location (Optional)</label>
                <input type="text" name="location" id="location" class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3" placeholder="e.g., 'California'">
            </div>
           </div>

          <button type="submit" [disabled]="isLoading()" class="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed h-10">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Generating...</span>
            } @else {
              <span>Generate Keywords</span>
            }
          </button>
        </form>
      </section>
      
      @if (keywords().length > 0 || isLoading()) {
        <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Generated Keywords</h3>
            <div class="mt-4 flex flex-wrap gap-2">
            @for(keyword of keywords(); track keyword) {
                <button (click)="copyToClipboard(keyword)" class="group bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white text-sm px-3 py-1.5 rounded-full transition-colors duration-200 flex items-center space-x-2">
                    <span>{{keyword}}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            }
            </div>
        </section>
      }
    </div>
  </div>
</div>
  `,
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
      // In a real app, you would pass the filter values to the service
      // const filters = {
      //   searchEngine: formData.get('search_engine'),
      //   country: formData.get('country'),
      //   language: formData.get('language'),
      //   location: formData.get('location'),
      // };
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