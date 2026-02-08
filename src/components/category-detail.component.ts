
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DataService, Category } from '../services/data.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 pb-20">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-4">
        <a routerLink="/" class="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <h1 class="text-xl font-bold text-white">{{ category()?.name }} Workouts</h1>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        @if (workouts().length === 0) {
          <div class="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50">
            <p class="text-slate-500 mb-4">No workouts here yet.</p>
            <button (click)="isAdding.set(true)" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full transition-colors">
              Add First Workout
            </button>
          </div>
        }

        @for (workout of workouts(); track workout.id) {
          <a [routerLink]="['/workout', workout.id]" 
             class="flex items-center gap-4 p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 active:bg-slate-800 transition-all">
            <div class="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
               @if (workout.image) {
                 <img [src]="workout.image" class="w-full h-full object-cover" alt="Workout">
               } @else {
                 <div class="w-full h-full flex items-center justify-center text-slate-600">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                 </div>
               }
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-white truncate">{{ workout.name }}</h3>
              <p class="text-sm text-slate-500">Tap to track progress</p>
            </div>
            <div class="text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </a>
        }
      </div>

      <!-- Floating Action Button -->
      <button (click)="isAdding.set(true)" 
              class="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:bg-emerald-400 active:scale-90 transition-all z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>

      <!-- Add Workout Modal/Overlay -->
      @if (isAdding()) {
        <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div class="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-slide-up">
            <div class="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 class="text-lg font-bold text-white">New {{ category()?.name }} Workout</h2>
              <button (click)="isAdding.set(false)" class="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form [formGroup]="addForm" (ngSubmit)="submitWorkout()" class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Workout Name</label>
                <input type="text" formControlName="name" placeholder="e.g. Incline Bench" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors">
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1">Photo (Optional)</label>
                <div class="relative">
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden">
                  <button type="button" (click)="fileInput.click()" 
                          class="w-full h-32 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all">
                    @if (previewImage()) {
                      <img [src]="previewImage()" class="w-full h-full object-cover rounded-lg">
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span class="text-sm">Tap to upload</span>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" [disabled]="addForm.invalid" 
                      class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all">
                Create Workout
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fade-in 0.2s ease-out; }
  `]
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);
  
  categoryId = signal<string>('');
  category = computed(() => this.dataService.getCategoryById(this.categoryId()));
  workouts = computed(() => this.dataService.getWorkoutsByCategory(this.categoryId())());
  
  isAdding = signal(false);
  previewImage = signal<string | null>(null);

  addForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.categoryId.set(params['id']);
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  submitWorkout() {
    if (this.addForm.valid && this.categoryId()) {
      this.dataService.addWorkout({
        categoryId: this.categoryId(),
        name: this.addForm.value.name!,
        image: this.previewImage() || undefined
      });
      this.isAdding.set(false);
      this.addForm.reset();
      this.previewImage.set(null);
    }
  }
}
