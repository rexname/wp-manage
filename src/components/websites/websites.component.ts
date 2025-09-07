
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';
import { WordpressWebsite } from '../../models/website.model';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class WebsitesComponent {
  wordpressService = inject(WordpressService);
  websites = this.wordpressService.websites;

  statusClasses = {
    connected: 'bg-green-500/20 text-green-400',
    disconnected: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  };
}
