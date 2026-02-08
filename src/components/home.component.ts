
import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="p-6">
      <header class="mb-8 mt-4">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          GymTracker AI
        </h1>
        <p class="text-slate-400 mt-2">Select a muscle group to train</p>
      </header>

      <div class="grid grid-cols-2 gap-4">
        @for (category of dataService.categories(); track category.id) {
          <a [routerLink]="['/category', category.id]" 
             class="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all active:scale-95">
            
            <img [ngSrc]="category.image" 
                 [alt]="category.name"
                 fill
                 class="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                 priority
            />
            
            <div class="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-slate-950/90 to-transparent">
              <span class="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {{ category.name }}
              </span>
            </div>
          </a>
        }
      </div>
    </div>
  `
})
export class HomeComponent {
  dataService = inject(DataService);
}
