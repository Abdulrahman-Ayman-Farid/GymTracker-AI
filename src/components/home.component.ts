
import { Component, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Log, Workout, Category } from '../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="p-6 min-h-screen bg-[#0a0a0a] pb-24">
      <header class="mb-10 mt-2 flex items-center justify-between">
        <div>
          <h2 class="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1 font-mono">{{ greeting() }}</h2>
          <h1 class="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/" class="w-12 h-12 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center shadow-sm hover:bg-white/5 transition-colors text-neutral-400 hover:text-white" title="Return to Welcome">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </a>
          <div class="w-12 h-12 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-brand-400"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6 20v-2a6 6 0 1 1 12 0v2"/><path d="M6 4v2a6 6 0 1 0 12 0V4"/></svg>
          </div>
        </div>
      </header>

      <!-- Weekly Stats -->
      <div class="grid grid-cols-2 gap-4 mb-10">
        <div class="bg-[#141414] border border-white/5 rounded-[1.5rem] p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-3 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            <span class="text-[10px] font-semibold uppercase tracking-widest font-mono">Weekly Vol</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-light text-white">{{ weeklyVolume() | number }}</span>
            <span class="text-sm text-neutral-500 font-mono">kg</span>
          </div>
        </div>
        <div class="bg-[#141414] border border-white/5 rounded-[1.5rem] p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-3 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span class="text-[10px] font-semibold uppercase tracking-widest font-mono">Sessions</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-light text-white">{{ weeklySessions() }}</span>
            <span class="text-sm text-neutral-500 font-mono">this week</span>
          </div>
        </div>
      </div>

      <!-- Consistency Heatmap -->
      <div class="mb-10">
        <h3 class="text-neutral-300 font-medium text-sm tracking-wide mb-5">Consistency (Last 28 Days)</h3>
        <div class="bg-[#141414] border border-white/5 rounded-[1.5rem] p-5 shadow-sm">
          <div class="grid grid-cols-7 gap-2">
            @for (day of heatmapDays(); track day.date.toISOString()) {
              <div class="aspect-square rounded-md border"
                   [ngClass]="{
                     'bg-brand-500 border-brand-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]': day.active,
                     'bg-white/5 border-white/5': !day.active,
                     'ring-2 ring-white/20': day.isToday
                   }"
                   [title]="day.date.toLocaleDateString()">
              </div>
            }
          </div>
          <div class="flex justify-between mt-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>4 Weeks Ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      <!-- Workout Routines -->
      <div class="mb-10">
        <h3 class="text-neutral-300 font-medium text-sm tracking-wide mb-5">Your Routines</h3>
        <div class="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x hide-scrollbar">
          @for (routine of dataService.routines(); track routine.id) {
            <a [routerLink]="['/routine', routine.id]" 
               class="snap-start shrink-0 w-64 bg-[#141414] border border-white/5 rounded-[1.5rem] p-5 hover:border-brand-500/30 transition-all active:scale-95 shadow-sm">
              <div class="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 class="text-white font-medium text-lg mb-1">{{ routine.name }}</h4>
              <p class="text-xs text-neutral-500 font-light line-clamp-2">{{ routine.description }}</p>
              <div class="mt-4 text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-white/5 inline-block px-2 py-1 rounded-md">
                {{ routine.workoutIds.length }} Exercises
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Recent Activity -->
      @if (recentLogs().length > 0) {
        <div class="mb-10">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-neutral-300 font-medium text-sm tracking-wide">Recent Activity</h3>
          </div>
          <div class="space-y-3">
            @for (log of recentLogs(); track log.id) {
              <a [routerLink]="['/workout', log.workoutId]" class="block bg-[#141414] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h4 class="text-white font-medium text-base mb-1">{{ getWorkoutName(log.workoutId) }}</h4>
                    <p class="text-xs text-neutral-500 font-mono">{{ formatDate(log.date) }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-brand-400 font-medium text-lg">{{ log.weight }}kg</span>
                    <span class="text-neutral-500 text-sm font-mono block mt-0.5">× {{ log.reps }} × {{ log.sets }}</span>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <span class="text-[10px] uppercase font-bold tracking-widest bg-white/5 text-neutral-400 px-2.5 py-1 rounded-md font-mono">Vol: {{ log.weight * log.reps * log.sets }}kg</span>
                  @if (log.rpe) {
                    <span class="text-[10px] uppercase font-bold tracking-widest bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded-md font-mono">RPE {{ log.rpe }}</span>
                  }
                </div>
              </a>
            }
          </div>
        </div>
      }

      <div class="mb-8">
        <h3 class="text-neutral-300 font-medium mb-5 text-sm tracking-wide">Muscle Groups</h3>
        <div class="grid grid-cols-2 gap-4">
          @for (category of dataService.categories(); track category.id) {
            <a [routerLink]="['/category', category.id]" 
               class="group relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer bg-[#141414] border border-white/5 hover:border-brand-500/30 transition-all active:scale-95 shadow-sm">
              
              <img [ngSrc]="category.image" 
                   [alt]="category.name"
                   fill
                   class="object-cover opacity-50 group-hover:opacity-30 transition-opacity duration-500 transform group-hover:scale-105"
                   priority
              />
              
              <div class="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent">
                <span class="text-lg font-medium text-white group-hover:text-brand-300 transition-colors tracking-tight">
                  {{ category.name }}
                </span>
              </div>
            </a>
          }
        </div>
      </div>
      
      <div class="p-5 rounded-2xl bg-white/5 border border-white/5 text-center mt-10">
        <p class="text-xs text-neutral-400 font-light tracking-wide">"The only bad workout is the one that didn't happen."</p>
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

  heatmapDays = computed(() => {
    const days = [];
    const today = new Date();
    // Generate last 28 days (4 weeks)
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();
      
      // Check if any log exists for this date
      const hasLog = this.dataService.logs().some(log => new Date(log.date).toDateString() === dateString);
      
      days.push({
        date: d,
        active: hasLog,
        isToday: i === 0
      });
    }
    return days;
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
