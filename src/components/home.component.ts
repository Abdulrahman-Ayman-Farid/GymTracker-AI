
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Log, Workout, Category } from '../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="p-6 min-h-screen bg-slate-950 pb-24">
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

      <!-- Weekly Stats -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            <span class="text-xs font-semibold uppercase tracking-wider">Weekly Vol</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-white">{{ weeklyVolume() | number }}</span>
            <span class="text-sm text-slate-500">kg</span>
          </div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span class="text-xs font-semibold uppercase tracking-wider">Sessions</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-white">{{ weeklySessions() }}</span>
            <span class="text-sm text-slate-500">this week</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      @if (recentLogs().length > 0) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-slate-300 font-semibold text-sm">Recent Activity</h3>
          </div>
          <div class="space-y-3">
            @for (log of recentLogs(); track log.id) {
              <a [routerLink]="['/workout', log.workoutId]" class="block bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="text-white font-medium">{{ getWorkoutName(log.workoutId) }}</h4>
                    <p class="text-xs text-slate-500">{{ formatDate(log.date) }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-emerald-400 font-bold">{{ log.weight }}kg</span>
                    <span class="text-slate-500 text-sm"> × {{ log.reps }} × {{ log.sets }}</span>
                  </div>
                </div>
                <div class="flex gap-2 mt-2">
                  <span class="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded">Vol: {{ log.weight * log.reps * log.sets }}kg</span>
                  @if (log.rpe) {
                    <span class="text-[10px] uppercase font-bold tracking-wider bg-indigo-900/40 text-indigo-300 px-2 py-1 rounded">RPE {{ log.rpe }}</span>
                  }
                </div>
              </a>
            }
          </div>
        </div>
      }

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

  // Calculate stats for the last 7 days
  weeklyLogs = computed(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.dataService.logs().filter(log => new Date(log.date) >= sevenDaysAgo);
  });

  weeklyVolume = computed(() => {
    return this.weeklyLogs().reduce((total, log) => total + (log.weight * log.reps * log.sets), 0);
  });

  weeklySessions = computed(() => {
    // Count unique days with logs
    const days = new Set(this.weeklyLogs().map(log => new Date(log.date).toDateString()));
    return days.size;
  });

  recentLogs = computed(() => {
    return [...this.dataService.logs()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  });

  getWorkoutName(workoutId: string): string {
    return this.dataService.getWorkoutById(workoutId)?.name || 'Unknown Workout';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  }
}
