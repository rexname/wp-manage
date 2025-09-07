
import { Injectable, signal } from '@angular/core';
import { WordpressWebsite } from '../models/website.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WordpressService {
  private mockWebsites: WordpressWebsite[] = [
    { id: '1', name: 'Tech Today', url: 'https://techtoday.example.com', status: 'connected', topic: 'latest technology trends', articlesPublished: 42 },
    { id: '2', name: 'Healthy Eats', url: 'https://healthyeats.example.com', status: 'connected', topic: 'healthy cooking and nutrition', articlesPublished: 128 },
    { id: '3', name: 'DIY Projects', url: 'https://diyprojects.example.com', status: 'disconnected', topic: 'do-it-yourself home projects', articlesPublished: 76 },
    { id: '4', name: 'Finance World', url: 'https://financeworld.example.com', status: 'error', topic: 'personal finance and investing', articlesPublished: 23 },
  ];

  websites = signal<WordpressWebsite[]>(this.mockWebsites);

  addWebsite(website: Omit<WordpressWebsite, 'id' | 'articlesPublished' | 'status'>) {
    const newWebsite: WordpressWebsite = {
        ...website,
        id: Date.now().toString(),
        articlesPublished: 0,
        status: 'connected', // Simulate successful connection
    };
    this.websites.update(sites => [...sites, newWebsite]);
    return of(newWebsite).pipe(delay(500));
  }

  updateWebsite(updatedSite: WordpressWebsite) {
    this.websites.update(sites =>
      sites.map(site => (site.id === updatedSite.id ? updatedSite : site))
    );
     return of(updatedSite).pipe(delay(500));
  }

  removeWebsite(id: string) {
    this.websites.update(sites => sites.filter(site => site.id !== id));
    return of({ success: true }).pipe(delay(500));
  }
  
  publishArticle(websiteId: string) {
    this.websites.update(sites => 
        sites.map(site => 
            site.id === websiteId 
                ? { ...site, articlesPublished: site.articlesPublished + 1 }
                : site
        )
    );
  }
}