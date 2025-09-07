
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
@if (notification(); as notif) {
  <div class="fixed bottom-5 right-5 z-50">
    <div [class]="'flex items-center p-4 text-white rounded-lg shadow-lg border-l-4 ' + typeClasses[notif.type]">
      <div class="flex-shrink-0">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="iconPaths[notif.type]"></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-medium">
        {{ notif.message }}
      </div>
    </div>
  </div>
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  notification = this.notificationService.notification;

  typeClasses = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  iconPaths = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
}