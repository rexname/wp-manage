
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  template: `
<div class="flex h-screen bg-gray-900 text-gray-100">
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
export class AppComponent {}