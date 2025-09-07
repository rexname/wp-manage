
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';


interface NavLink {
  path: string;
  label: string;
  icon: string; // SVG path data
}

@Component({
  selector: 'app-sidebar',
  template: `
<aside [class]="'relative h-full flex flex-col bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out ' + (isExpanded() ? 'w-64' : 'w-20')">
  <div class="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343l-1.414-1.414m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    @if (isExpanded()) {
      <span class="ml-2 text-xl font-bold text-gray-800 dark:text-white">WP Suite</span>
    }
  </div>
  <nav class="mt-4 flex-1 overflow-y-auto">
    <ul>
      @for (link of navLinks(); track link.path) {
        <li>
          <a [routerLink]="link.path" routerLinkActive="bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-white" 
             class="flex items-center h-12 px-6 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="link.icon" />
            </svg>
            @if (isExpanded()) {
              <span class="ml-4 font-medium">{{ link.label }}</span>
            }
          </a>
        </li>
      }
    </ul>
  </nav>

  <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
    <button (click)="themeService.toggleTheme()" 
            class="w-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200">
        @if (themeService.theme() === 'dark') {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        }
        @if (isExpanded()) {
            <span class="ml-4 text-sm font-semibold">
                {{ themeService.theme() === 'dark' ? 'Light Mode' : 'Dark Mode' }}
            </span>
        }
    </button>
  </div>


  <button (click)="toggleSidebar()" class="absolute -right-4 top-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-transform duration-300"
          [class.rotate-180]="!isExpanded()">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class SidebarComponent {
  themeService = inject(ThemeService);
  isExpanded = signal(true);

  navLinks = signal<NavLink[]>([
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/websites', label: 'Websites', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945C21.055 11 21 10.555 21 10c0-5.523-4.477-10-10-10S1 4.477 1 10c0 .555.055 1 .945 1z M14 15V9h-4v6h4z' },
    { path: '/keywords', label: 'Keywords', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { path: '/generator', label: 'Generator', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ]);

  toggleSidebar() {
    this.isExpanded.update(value => !value);
  }
}