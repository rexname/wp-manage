
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `
<div class="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <app-sidebar></app-sidebar>
  <main class="flex-1 flex flex-col overflow-hidden">
    <div class="flex-1 p-6 lg:p-8 overflow-y-auto">
      <router-outlet></router-outlet>
    </div>
  </main>
  <app-notification></app-notification>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NotificationComponent],
})
export class AppComponent {
  // Initialize the theme service to apply the theme on startup
  private themeService = inject(ThemeService);
}