
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from '../../services/wordpress.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
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
