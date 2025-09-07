
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';
import { WordpressWebsite } from '../../models/website.model';
import { WebsiteModalComponent } from './website-modal.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-websites',
  template: `
<div class="space-y-8">
  <header class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Websites</h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Add, monitor, and manage your WordPress sites.</p>
    </div>
    <button (click)="openModal()" class="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      <span>Add Website</span>
    </button>
  </header>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="p-4 font-semibold text-gray-600 dark:text-gray-300">Website Name</th>
            <th class="p-4 font-semibold text-gray-600 dark:text-gray-300">URL</th>
            <th class="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
            <th class="p-4 font-semibold text-center text-gray-600 dark:text-gray-300">Articles</th>
            <th class="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (site of websites(); track site.id) {
            <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
              <td class="p-4 font-medium text-gray-800 dark:text-gray-200">{{ site.name }}</td>
              <td class="p-4 text-gray-500 dark:text-gray-400"><a [href]="site.url" target="_blank" class="hover:text-indigo-500 dark:hover:text-indigo-400">{{ site.url }}</a></td>
              <td class="p-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + statusClasses[site.status]">
                  {{ site.status }}
                </span>
              </td>
              <td class="p-4 text-center text-gray-600 dark:text-gray-300 font-mono">{{ site.articlesPublished }}</td>
              <td class="p-4">
                 <div class="flex items-center space-x-2">
                    <button (click)="openModal(site)" class="text-gray-400 hover:text-indigo-500 transition-colors" aria-label="Edit">
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button (click)="deleteWebsite(site.id)" class="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete">
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="p-8 text-center text-gray-400 dark:text-gray-500">No websites added yet.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
</div>

@if(isModalOpen()) {
  <app-website-modal 
    [website]="editingWebsite()"
    (close)="closeModal()"
    (save)="handleSave($event)">
  </app-website-modal>
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, WebsiteModalComponent],
})
export class WebsitesComponent {
  wordpressService = inject(WordpressService);
  notificationService = inject(NotificationService);
  websites = this.wordpressService.websites;

  isModalOpen = signal(false);
  editingWebsite = signal<WordpressWebsite | null>(null);

  statusClasses = {
    connected: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
    disconnected: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  };

  openModal(site: WordpressWebsite | null = null) {
    this.editingWebsite.set(site);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingWebsite.set(null);
  }

  handleSave(websiteData: Omit<WordpressWebsite, 'id' | 'articlesPublished' | 'status'> | WordpressWebsite) {
    if ('id' in websiteData) {
      // Editing existing website
      this.wordpressService.updateWebsite(websiteData);
      this.notificationService.success(`Website "${websiteData.name}" updated successfully!`);
    } else {
      // Adding new website
      this.wordpressService.addWebsite(websiteData);
      this.notificationService.success(`Website "${websiteData.name}" added successfully!`);
    }
    this.closeModal();
  }
  
  deleteWebsite(id: string) {
    const site = this.websites().find(s => s.id === id);
    if(confirm(`Are you sure you want to delete "${site?.name}"?`)) {
      this.wordpressService.removeWebsite(id);
      this.notificationService.success(`Website "${site?.name}" has been removed.`);
    }
  }

}