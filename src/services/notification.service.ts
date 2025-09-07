
import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notification = signal<Notification | null>(null);

  show(notification: Notification) {
    this.notification.set(notification);
    setTimeout(() => {
      this.notification.set(null);
    }, notification.duration || 3000);
  }

  success(message: string) {
    this.show({ message, type: 'success' });
  }

  error(message: string) {
    this.show({ message, type: 'error' });
  }

  info(message: string) {
    this.show({ message, type: 'info' });
  }
}
