import { Component, ChangeDetectionStrategy, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressWebsite } from '../../models/website.model';
// FIX: Import FormsModule for template-driven forms.
import { FormsModule } from '@angular/forms';

type WebsiteFormData = Omit<WordpressWebsite, 'id' | 'articlesPublished' | 'status'>;

@Component({
  selector: 'app-website-modal',
  template: `
<div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" (click)="close.emit()"></div>
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl" (click)="$event.stopPropagation()">
    <form (submit)="onSave($event)">
      <header class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Website' : 'Add New Website' }}
        </h2>
      </header>
      <main class="p-6 space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Website Name</label>
            <input type="text" id="name" name="name" required [(ngModel)]="formData.name"
                   class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3"
                   placeholder="e.g., My Awesome Blog">
        </div>
        <div>
            <label for="url" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Website URL</label>
            <input type="url" id="url" name="url" required [(ngModel)]="formData.url"
                   class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3"
                   placeholder="https://example.com">
        </div>
        <div>
            <label for="topic" class="block text-sm font-medium text-gray-600 dark:text-gray-300">Main Topic/Niche</label>
            <input type="text" id="topic" name="topic" required [(ngModel)]="formData.topic"
                   class="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white h-10 px-3"
                   placeholder="e.g., Healthy Recipes">
        </div>
      </main>
      <footer class="px-6 py-4 flex justify-end items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">
            {{ isEditing ? 'Save Changes' : 'Add Website' }}
          </button>
      </footer>
    </form>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // FIX: The `imports` array does not support promises. Use a static import for FormsModule.
  imports: [CommonModule, FormsModule],
})
export class WebsiteModalComponent implements OnInit {
  website = input<WordpressWebsite | null>(null);
  close = output<void>();
  save = output<WebsiteFormData | WordpressWebsite>();

  formData: WebsiteFormData & { status?: 'connected' | 'disconnected' | 'error' } = {
    name: '',
    url: '',
    topic: '',
  };

  isEditing = false;

  ngOnInit() {
    const site = this.website();
    if (site) {
      this.isEditing = true;
      this.formData = { ...site };
    }
  }

  onSave(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form.checkValidity()) {
        if (this.isEditing) {
            this.save.emit({ ...this.website(), ...this.formData } as WordpressWebsite);
        } else {
            this.save.emit(this.formData);
        }
    }
  }
}
