import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] pb-20">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <a routerLink="/home" class="p-2 rounded-full hover:bg-white/5 text-neutral-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <div>
          <h1 class="text-xl font-bold text-white tracking-tight">{{ routine()?.name }}</h1>
          <p class="text-xs text-neutral-500 font-light">{{ routine()?.description }}</p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        @if (routineWorkouts().length === 0) {
          <div class="text-center py-16 px-4 rounded-[1.5rem] border border-dashed border-white/10 bg-[#141414]/50">
            <p class="text-neutral-500 mb-6 font-light">No exercises in this routine yet.</p>
          </div>
        }

        @for (workout of routineWorkouts(); track workout.id; let i = $index) {
          <a [routerLink]="['/workout', workout.id]" 
             class="flex items-center gap-4 p-4 bg-[#141414] rounded-[1.5rem] border border-white/5 hover:border-white/10 active:bg-white/5 transition-all shadow-sm">
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 font-mono text-sm font-bold shrink-0">
              {{ i + 1 }}
            </div>
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-[#0a0a0a] flex-shrink-0 relative border border-white/5">
               @if (workout.image) {
                 <img [src]="workout.image" class="w-full h-full object-cover" alt="Workout">
               } @else {
                 <div class="w-full h-full flex items-center justify-center text-neutral-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                 </div>
               }
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-white truncate">{{ workout.name }}</h3>
              <p class="text-sm text-neutral-500 font-light mt-0.5">Tap to track progress</p>
            </div>
            <div class="text-neutral-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </a>
        }
      </div>
    </div>
  `
})
export class RoutineDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  
  routineId = signal<string>('');
  routine = computed(() => this.dataService.getRoutineById(this.routineId()));
  
  routineWorkouts = computed(() => {
    const r = this.routine();
    if (!r) return [];
    return r.workoutIds.map(id => this.dataService.getWorkoutById(id)).filter(w => !!w) as any[];
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.routineId.set(params['id']);
    });
  }
}
