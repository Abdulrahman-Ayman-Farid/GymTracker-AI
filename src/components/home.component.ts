
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="p-6 min-h-screen bg-slate-950">
      <header class="mb-8 mt-2 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">{{ greeting() }}</h2>
          <h1 class="text-2xl font-bold text-white">
            Dashboard
          </h1>
        </div>
        <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20v-2a6 6 0 1 1 12 0v2"/><path d="M6 4v2a6 6 0 1 0 12 0V4"/></svg>
        </div>
      </header>

      <div class="mb-6">
        <h3 class="text-slate-300 font-semibold mb-4 text-sm">Muscle Groups</h3>
        <div class="grid grid-cols-2 gap-4">
          @for (category of dataService.categories(); track category.id) {
            <a [routerLink]="['/category', category.id]" 
               class="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all active:scale-95 shadow-md">
              
              <img [ngSrc]="category.image" 
                   [alt]="category.name"
                   fill
                   class="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 transform group-hover:scale-105"
                   priority
              />
              
              <div class="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                <span class="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {{ category.name }}
                </span>
              </div>
            </a>
          }
        </div>
      </div>
      
      <div class="p-4 rounded-xl bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 text-center">
        <p class="text-xs text-indigo-300">"The only bad workout is the one that didn't happen."</p>
      </div>
    </div>
  `
})
export class HomeComponent {
  dataService = inject(DataService);

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });
}
