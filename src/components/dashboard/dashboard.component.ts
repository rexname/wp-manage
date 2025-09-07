
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-dashboard',
  template: `
<div class="space-y-8">
  <header>
    <h1 class="text-3xl font-bold text-white">Dashboard</h1>
    <p class="mt-2 text-gray-400">Welcome back! Here's a summary of your WordPress empire.</p>
  </header>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    @if (stats(); as s) {
      <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-4 shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300">
        <div class="bg-indigo-600/20 text-indigo-400 p-3 rounded-full">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Total Websites</p>
          <p class="text-2xl font-bold text-white">{{ s.totalSites }}</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-4 shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300">
        <div class="bg-teal-600/20 text-teal-400 p-3 rounded-full">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Connected</p>
          <p class="text-2xl font-bold text-white">{{ s.connectedSites }}</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-4 shadow-lg hover:shadow-sky-500/20 transition-shadow duration-300">
        <div class="bg-sky-600/20 text-sky-400 p-3 rounded-full">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Articles Published</p>
          <p class="text-2xl font-bold text-white">{{ s.articlesPublished }}</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-4 shadow-lg hover:shadow-rose-500/20 transition-shadow duration-300">
        <div class="bg-rose-600/20 text-rose-400 p-3 rounded-full">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400">Issues Found</p>
          <p class="text-2xl font-bold text-white">{{ s.issues }}</p>
        </div>
      </div>
    }
  </section>

  <section class="bg-gray-800 rounded-lg p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-white">Recent Activity</h2>
    <p class="mt-2 text-gray-400">Display recent logs, published articles, or website status changes here.</p>
    <div class="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-md">
      <p class="text-gray-500">Activity Log (Coming Soon)</p>
    </div>
  </section>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DashboardComponent {
  private wordpressService = inject(WordpressService);

  stats = computed(() => {
    const sites = this.wordpressService.websites();
    const totalSites = sites.length;
    const connectedSites = sites.filter(s => s.status === 'connected').length;
    const articlesPublished = sites.reduce((sum, s) => sum + s.articlesPublished, 0);
    const issues = sites.filter(s => s.status !== 'connected').length;
    return { totalSites, connectedSites, articlesPublished, issues };
  });
}