
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

// NOTE: Since Angular animations might not be supported in all Applet environments,
// this is a placeholder. If they don't work, the notification will still appear/disappear,
// just without the smooth transition. A pure CSS transition is safer.
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
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
